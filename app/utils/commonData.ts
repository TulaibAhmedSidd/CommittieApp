export enum InputTypes {
  text = "text",
  email = "email",
  password = "password",
  submit = "submit",
}
export enum CommonStringData {
  Name = "Name",
  Member = "Member",
  Add = "Add",
  Edit = "Edit",
  Delete = "Delete",
  Password = "Password",
  Email = "Email",
  Existing = "Existing",
}
export enum AppRoutes {
  adminLogin = "/admin/login",
}
export enum LocalKeys {
  admin_token = "admin_token",
}
export enum ApiMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}
export enum ApiHeaderType {
  Content_Type = "Content-Type",
  application_json = "application/json",
}
export enum APIRoute {
  member = "/api/member/",
  adminMember = "/api/member/admin-members/",
}
export enum ResponseError {
  FetchError = "Failed to Fetch :",
  UpdateError = "Failed to Update :",
  AddError = "Failed to Add :",
  DeleteError = "Failed to Delete :",
}
export enum ResponseSuccess {
  FetchSuccess = "Successfully Fetched :",
  UpdateSuccess = "Successfully Updated :",
  AddSuccess = "Successfully Added :",
  DeleteSuccess = "Successfully Deleted :",
}
export enum ToastPosition {
  BottomCenter = "bottom-center",
  BottomRight = "bottom-right",
  TopRight = "top-right",
}
