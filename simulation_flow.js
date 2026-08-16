const { chromium } = require('playwright');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = "mongodb+srv://ahsidtullu:tulaib123@cluster0.iy47j.mongodb.net/committie_db?retryWrites=true&w=majority&appName=Cluster0";
const BASE_URL = 'http://localhost:3000';

const timestamp = Date.now();
const orgEmail = `sim_org_${timestamp}@test.com`;
const mem1Email = `sim_mem1_${timestamp}@test.com`;
const mem2Email = `sim_mem2_${timestamp}@test.com`;
const mem3Email = `sim_mem3_${timestamp}@test.com`;
const committeeName = `Sim_Comm_No_${timestamp}`;

async function main() {
  console.log("--------------------------------------------------");
  console.log("Starting full E2E Committee Lifecycle Simulation...");
  console.log("--------------------------------------------------");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Visit Home Page
    console.log("Step 1: Navigating to Home Page...");
    await page.goto(BASE_URL);
    await page.screenshot({ path: 'step1_home_page.png' });
    console.log("Home Page visited successfully!");

    // 2. Register Organizer/Admin
    console.log(`Step 2: Registering Organizer (${orgEmail})...`);
    await page.goto(`${BASE_URL}/register?role=organizer`);
    await page.fill('input[name="name"]', 'Sim Organizer');
    await page.fill('input[type="email"]', orgEmail);
    await page.fill('input[name="phone"]', '03001234567');
    await page.selectOption('select[name="city"]', { label: 'Karachi' });
    await page.fill('input[name="county"]', 'Gulshan-e-Iqbal');
    await page.fill('input[name="password"]', 'Test1234');
    
    // Click submit
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'step2_org_registered.png' });
    console.log("Organizer registration submitted!");

    // 3. Connect to MongoDB to approve the organizer
    console.log("Step 3: Connecting to Database to approve Organizer...");
    await mongoose.connect(MONGO_URI);
    const adminCollection = mongoose.connection.db.collection('admins');
    
    // Mark organizer as approved and verified
    const updateOrg = await adminCollection.updateOne(
      { email: orgEmail },
      { $set: { status: 'approved', verificationStatus: 'verified' } }
    );
    console.log("Organizer approved in DB:", updateOrg);

    const organizerDoc = await adminCollection.findOne({ email: orgEmail });
    const organizerId = organizerDoc._id.toString();

    // 4. Log in as the approved Organizer
    console.log("Step 4: Logging in as the approved Organizer...");
    await page.goto(`${BASE_URL}/adminLogin`);
    await page.fill('input[type="email"]', orgEmail);
    await page.fill('input[type="password"]', 'Test1234');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/admin$/, { timeout: 15000 });
    console.log("Organizer logged in successfully! Reached Admin Dashboard.");
    await page.screenshot({ path: 'step3_admin_dashboard.png' });

    // 5. Create a 3-member, 3-month committee via API evaluate (using Admin session)
    console.log(`Step 5: Creating committee '${committeeName}' via API...`);
    const committeeResult = await page.evaluate(async (name) => {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/committee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name,
          description: "Simulation committee for E2E validation",
          maxMembers: 3,
          monthlyAmount: 1000,
          monthDuration: 3,
          startDate: new Date().toISOString(),
          bankDetails: {
            accountTitle: "Sim Pool Account",
            bankName: "HBL",
            iban: "PK12HBL0987654321"
          },
          organizerFee: 0,
          isFeeMandatory: false,
          requireDocuments: false,
          mandatoryDocuments: []
        })
      });
      if (!res.ok) throw new Error("Failed to create committee");
      return res.json();
    }, committeeName);

    const committeeId = committeeResult._id;
    console.log(`Committee created successfully! ID: ${committeeId}`);

    // 6. Register 3 members and approve them in DB directly
    console.log("Step 6: Seeding 3 approved/verified members directly to MongoDB...");
    const memberCollection = mongoose.connection.db.collection('members');
    const hashedPassword = await bcrypt.hash('Test1234', 10);
    
    const membersData = [
      { email: mem1Email, name: 'Sim Member 1' },
      { email: mem2Email, name: 'Sim Member 2' },
      { email: mem3Email, name: 'Sim Member 3' }
    ];

    const memberIds = [];

    for (const m of membersData) {
      const result = await memberCollection.updateOne(
        { email: m.email },
        {
          $set: {
            name: m.name,
            password: hashedPassword,
            phone: 3001112233,
            status: 'approved',
            verificationStatus: 'verified',
            country: 'Pakistan',
            city: 'Karachi',
            county: 'Gulshan',
            location: { type: 'Point', coordinates: [67.0011, 24.8607] },
            committees: [],
            organizers: [],
            pendingOrganizers: [],
            documents: []
          }
        },
        { upsert: true }
      );
      
      const doc = await memberCollection.findOne({ email: m.email });
      memberIds.push(doc._id.toString());
    }
    console.log("Members seeded successfully! IDs:", memberIds);

    // 7. Members submit Join Requests via API in their browser contexts
    console.log("Step 7: Logging in as members and submitting Join Requests...");
    const emails = [mem1Email, mem2Email, mem3Email];
    
    for (let i = 0; i < 3; i++) {
      const email = emails[i];
      const memId = memberIds[i];

      console.log(`  Logging in as Member ${i+1} (${email})...`);
      await page.evaluate(() => localStorage.clear());
      await context.clearCookies();

      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', 'Test1234');
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/userDash$/, { timeout: 15000 });

      console.log(`  Submitting Join Request for Member ${i+1}...`);
      const joinResult = await page.evaluate(async ({ commId, memberId }) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/committee/${commId}/request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ memberId })
        });
        if (!res.ok) throw new Error("Failed to request join");
        return res.json();
      }, { commId: committeeId, memberId: memId });
      console.log(`  Join request submitted:`, joinResult);
    }

    // 8. Log in back as Organizer to Approve requests
    console.log("Step 8: Logging back in as Organizer to approve Join Requests...");
    await page.evaluate(() => localStorage.clear());
    await context.clearCookies();

    await page.goto(`${BASE_URL}/adminLogin`);
    await page.fill('input[type="email"]', orgEmail);
    await page.fill('input[type="password"]', 'Test1234');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin$/, { timeout: 15000 });

    for (let i = 0; i < 3; i++) {
      const memId = memberIds[i];
      console.log(`  Approving request for Member ID: ${memId}...`);
      const approveResult = await page.evaluate(async ({ commId, memberId }) => {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`/api/committee/${commId}/request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ memberId, action: "approve" })
        });
        if (!res.ok) throw new Error("Failed to approve request");
        return res.json();
      }, { commId: committeeId, memberId: memId });
      console.log(`  Approved!`, approveResult);
    }
    await page.screenshot({ path: 'step4_members_joined.png' });

    // 9. Trigger Drawing Results Announcement (POST /api/announcement)
    console.log("Step 9: Announcing Results (Drawing positions/turns)...");
    const announceResult = await page.evaluate(async (commId) => {
      const res = await fetch("/api/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ committeeId: commId })
      });
      if (!res.ok) throw new Error("Failed to announce results");
      return res.json();
    }, committeeId);
    console.log("Draw positions announced! Results:", announceResult.result || announceResult);

    // Fetch the drawing results turns from the database
    const committeeCollection = mongoose.connection.db.collection('committees');
    let committee = await committeeCollection.findOne({ _id: new mongoose.Types.ObjectId(committeeId) });
    const drawingTurns = committee.result;
    console.log("Drawing Turns order:", drawingTurns);

    // 10. Simulate 3 Months of Payments & Payouts
    console.log("Step 10: Starting Monthly Payments & Payouts simulation...");

    for (let month = 1; month <= 3; month++) {
      console.log(`\n--- Month ${month} ---`);
      
      // Find the beneficiary for this month
      const currentTurn = drawingTurns.find(t => t.position === month);
      const beneficiaryId = currentTurn.member.toString();
      const beneficiaryEmail = emails[memberIds.indexOf(beneficiaryId)];
      console.log(`Beneficiary of Month ${month} is Member ID: ${beneficiaryId} (${beneficiaryEmail})`);

      // For all non-beneficiary members, reconcile payments
      for (const mId of memberIds) {
        if (mId === beneficiaryId) continue; // Skip beneficiary
        console.log(`  Force reconciling payment for Member ID: ${mId}...`);
        const payRes = await page.evaluate(async ({ commId, memberId }) => {
          const token = localStorage.getItem("admin_token");
          const res = await fetch(`/api/committee/${commId}/payment`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              paymentId: "FORCE_RECONCILE",
              status: "verified",
              memberId: memberId
            })
          });
          if (!res.ok) throw new Error("Failed to verify payment");
          return res.json();
        }, { commId: committeeId, memberId: mId });
        console.log(`  Payment status:`, payRes.message);
      }

      // Record payout for the beneficiary
      console.log(`  Recording payout of 3000 to Beneficiary ID: ${beneficiaryId}...`);
      const payoutRes = await page.evaluate(async ({ commId, memberId, month }) => {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`/api/committee/${commId}/payout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            month: month,
            memberId: memberId,
            amount: 3000,
            transactionId: `TXN_SIM_M${month}_${Date.now()}`,
            screenshot: "https://example.com/receipt.jpg"
          })
        });
        if (!res.ok) throw new Error("Failed to record payout");
        return res.json();
      }, { commId: committeeId, memberId: beneficiaryId, month });
      console.log(`  Payout status:`, payoutRes.message);

      // Advance month
      if (month < 3) {
        console.log(`  Advancing committee to the next month...`);
        const advanceRes = await page.evaluate(async (commId) => {
          const token = localStorage.getItem("admin_token");
          const res = await fetch(`/api/committee/${commId}/status`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ action: "advance_month" })
          });
          if (!res.ok) throw new Error("Failed to advance month");
          return res.json();
        }, committeeId);
        console.log(`  Advance status:`, advanceRes.message);
      } else {
        // Last month: close the committee
        console.log(`  Closing the committee (marks as finished)...`);
        const closeRes = await page.evaluate(async (commId) => {
          const token = localStorage.getItem("admin_token");
          const res = await fetch(`/api/committee/${commId}/status`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ action: "close_bc" })
          });
          if (!res.ok) throw new Error("Failed to close committee");
          return res.json();
        }, committeeId);
        console.log(`  Close status:`, closeRes.message);
      }
    }
    await page.screenshot({ path: 'step5_committee_finished.png' });

    // 11. Verify History visibility
    console.log("\nStep 11: Verifying History logs...");
    committee = await committeeCollection.findOne({ _id: new mongoose.Types.ObjectId(committeeId) });
    console.log(`Final Committee status: '${committee.status}'`);
    console.log(`Completed Months: ${committee.currentMonth - 1}/${committee.monthDuration}`);
    console.log("Organizer ID:", organizerId);

    // Verify Organizer see committee in history
    console.log("Checking Organizer history...");
    await page.goto(`${BASE_URL}/admin/manage-committie`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'step6_admin_history.png' });

    // Verify Member 1 see committee in history
    console.log(`Checking Member 1 (${mem1Email}) history...`);
    await page.evaluate(() => localStorage.clear());
    await context.clearCookies();

    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', mem1Email);
    await page.fill('input[type="password"]', 'Test1234');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/userDash$/, { timeout: 15000 });
    
    await page.goto(`${BASE_URL}/userDash`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'step7_member_history.png' });

    console.log("--------------------------------------------------");
    console.log("Simulation finished successfully!");
    console.log("--------------------------------------------------");

  } catch (err) {
    console.error("Simulation script encountered an error:", err);
  } finally {
    await mongoose.disconnect();
    await browser.close();
  }
}

main();
