const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const BASE_URL = 'http://localhost:3000';
  const committeeName = `Test_Comm_${Date.now()}`;

  console.log('Starting E2E flow test with direct API orchestration...');

  try {
    // 1. Log in as Admin/Organizer
    console.log('Logging in as Admin at /adminLogin...');
    await page.goto(`${BASE_URL}/adminLogin`);
    await page.fill('input[type="email"]', 'admin@gmail.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button:has-text("Login"), button[type="submit"]');

    console.log('Waiting for redirect to Admin Dashboard (/admin)...');
    // Using RegExp to match exactly /admin, to prevent matching /adminLogin
    await page.waitForURL(/\/admin$/, { timeout: 15000 });
    console.log('Successfully navigated to Admin Dashboard. Current URL:', page.url());
    await page.waitForTimeout(2000);

    // 2. Create a committee via evaluate (using Admin session token)
    console.log('Creating a committee via API:', committeeName);
    const committeeResult = await page.evaluate(async (name) => {
      const token = localStorage.getItem("admin_token");
      const adminDetail = JSON.parse(localStorage.getItem("admin_detail"));
      
      const res = await fetch("/api/committee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name,
          description: "This is a programmatic test committee",
          maxMembers: 10,
          monthlyAmount: 5000,
          monthDuration: 10,
          startDate: new Date().toISOString(),
          bankDetails: {
            accountTitle: "Admin Main Account",
            bankName: "HBL",
            iban: "PK12HBL34567890"
          },
          organizerFee: 0,
          isFeeMandatory: false,
          requireDocuments: false,
          mandatoryDocuments: []
        })
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to create committee: ${res.status} ${errorText}`);
      }
      return res.json();
    }, committeeName);

    const committeeId = committeeResult._id;
    console.log(`Committee created successfully! ID: ${committeeId}`);
    await page.screenshot({ path: 'admin_dashboard_after_create.png' });

    // 3. Log out Admin by clearing cookies and localStorage
    console.log('Logging out Admin...');
    await page.evaluate(() => localStorage.clear());
    await context.clearCookies();

    // 4. Log in as Member (member@gmail.com / password)
    console.log('Logging in as Member at /login...');
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'member@gmail.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("Sign In"), button[type="submit"]');

    console.log('Waiting for redirect to Member Dashboard (/userDash)...');
    await page.waitForURL(/\/userDash$/, { timeout: 15000 });
    console.log('Successfully navigated to Member Dashboard. Current URL:', page.url());
    await page.waitForTimeout(2000);

    // 5. Submit join request via evaluate (using Member session token)
    console.log('Submitting request to join committee...');
    const requestResult = await page.evaluate(async (commId) => {
      const token = localStorage.getItem("token");
      const member = JSON.parse(localStorage.getItem("member"));
      const memberId = member._id;

      const res = await fetch(`/api/committee/${commId}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ memberId })
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to submit request: ${res.status} ${errorText}`);
      }
      return res.json();
    }, committeeId);

    console.log('Request to join submitted successfully!', requestResult);
    await page.screenshot({ path: 'member_dashboard_after_join.png' });

    // Get the member's details to approve
    const memberObj = await page.evaluate(() => JSON.parse(localStorage.getItem("member")));
    const memberId = memberObj._id;

    // 6. Log out Member
    console.log('Logging out Member...');
    await page.evaluate(() => localStorage.clear());
    await context.clearCookies();

    // 7. Log back in as Admin to Approve
    console.log('Logging back in as Admin...');
    await page.goto(`${BASE_URL}/adminLogin`);
    await page.fill('input[type="email"]', 'admin@gmail.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button:has-text("Login"), button[type="submit"]');

    await page.waitForURL(/\/admin$/, { timeout: 15000 });
    await page.waitForTimeout(2000);

    // 8. Approve the join request via evaluate (using Admin session token)
    console.log(`Approving join request for Member ID: ${memberId}...`);
    const approveResult = await page.evaluate(async ({ commId, memId }) => {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/committee/${commId}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          memberId: memId,
          action: "approve"
        })
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to approve request: ${res.status} ${errorText}`);
      }
      return res.json();
    }, { commId: committeeId, memId: memberId });

    console.log('Join request approved successfully!', approveResult);
    await page.screenshot({ path: 'admin_dashboard_after_approve.png' });

    console.log('E2E Flow Test Completed Successfully!');
  } catch (err) {
    console.error('Test script encountered an error:', err);
  } finally {
    await browser.close();
  }
})();
