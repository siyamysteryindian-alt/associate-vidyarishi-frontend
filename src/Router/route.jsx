import * as React from "react";
import * as ReactDOM from "react-dom/client";
import Login from "../Common/Login";
import { createBrowserRouter } from "react-router-dom";

import ForgetPassword from "../Common/ForgetPassword";
import ErrorPage from "../Pages/ErrorPage";
import Dashboard from "../Components/Admin/Dashboard";
import OtpVerification from "../Common/OtpVerification";
import AdminMain from "../Pages/Admin/AdminMain";

import AdminUniversity from "../Components/Admin/Acadamics/Universities/AdminUniversity";
import AdminDepartments from "../Components/Admin/Acadamics/Departments/AdminDepartments";
import AdminPrograms from "../Components/Admin/Acadamics/Programs/AdminPrograms";
import AdminSyllabus from "../Components/Admin/Acadamics/Syllabus/AdminSyllabus";
import AdminSpecialization from "../Components/Admin/Acadamics/Specialization/AdminSpecialization";

import Applications from "../Components/Admin/Admissions/Application/Applications";
import Freshapplication from "../Components/Admin/Admissions/FreshApplication/AdminFreshapplication";
import Reregister from "../Components/Admin/Admissions/Re-Register/Reregister";

import AdminSettings from "../Components/Admin/Settings/AdminSettings";
import Emailtemplate from "../Components/Admin/Settings/Childrens/Emailtemplate";
import Pageaccess from "../Components/Admin/Settings/Childrens/Pageaccess";
import Admissiontype from "../Components/Admin/Settings/Childrens/Admissiontype";
import Mode from "../Components/Admin/Settings/Childrens/Mode";
import Programtype from "../Components/Admin/Settings/Childrens/Programtype";
import Schema from "../Components/Admin/Settings/Childrens/Schema";

import AdminUniversityManager from "../Components/Admin/Users/University_Manager/AdminUniversityManager";
import AdminOperations from "../Components/Admin/Users/Operations/AdminOperations";
import AdminCenter_Master from "../Components/Admin/Users/Center_Master/AdminCenter_Master";
import AdminCenter from "../Components/Admin/Users/Center/AdminCenter";
import AdminSubcenter from "../Components/Admin/Users/Sub_Center/AdminSubcenter";
import AdminCounsellors from "../Components/Admin/Users/Counsellors/AdminCounsellors";
import AdminSubCounsellors from "../Components/Admin/Users/Sub_Counsellors/AdminSubCounsellors";
import AdminStudent from "../Components/Admin/Users/Students/AdminStudent";

import AdminCenterLedger from "../Components/Admin/Accounts/CenterLedger/AdminCenterLedger";
import AdminOfflinePaymentStudent from "../Components/Admin/Accounts/Offline_Payment_Student/Admin_OfflinePaymentStudent";
import AdminOnlinePaymentStudent from "../Components/Admin/Accounts/Online_Payment_Student/Admin_OnlinePaymentStudent";
import AdminStudentLedger from "../Components/Admin/Accounts/Student_Ledger/Admin_StudentLedger";

import MyProfile from "../Components/Admin/Profile/MyProfile";
import ChangePassword from "../Components/Admin/Profile/ChangePassword";
import AdminMainLeads from "../Components/Admin/Leads/AdminMainLeads";
import AdminAccountant from "../Components/Admin/Users/Accounts/AdminAccountant";
import Admissionsession from "../Components/Admin/Settings/Childrens/Admissionsession";
import Examsession from "../Components/Admin/Settings/Childrens/Examsession";
import CenterLayout from "../Pages/Center/CenterLayout";
import CenterDashboard from "../Components/Center/CenterDashboard";
import OperationalLayout from "../Pages/Operational/OperationalLayout";
import OperationalDashboard from "../Components/Operational/OperationalDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AccountantLayout from "../Pages/Accountant/AccountantLayout";
import CounsellorLayout from "../Pages/Counsellor/CounsellorLayout";
import SubcounsellorLayout from "../Pages/Subcounsellor/SubcounsellorLayout";
import SubcenterLayout from "../Pages/Subcenter/SubcenterLayout";
import AccountantDashboard from "../Components/Accountant/AccountantDashboard";
import CounsellorDashboard from "../Components/Counsellor/CounsellorDashboard";
import SubcenterDashboard from "../Components/Subcenter/SubcenterDashboard";
import SubcounsellorDashboard from "../Components/Subcounsellor/SubcounsellorDashboard";
import Notice from "../Components/Admin/Settings/Childrens/Notice";
import AdminUpdateStudent from "../Components/Admin/Admissions/UpdateApplication/AdminUpdateStudent";
import CourierCompany from "../Components/Admin/Courier/CourierCompany";
import AdminNotifyWindow from "../Components/NotifyWindow/AdminNotifyWindow";
import UniversityDashboard from "../Components/University/universityDashboard";
import UniversityMLayout from "../Pages/UniversityManager/UniversityMLayout";
import ProspReg from "../Components/Leads/ProspReg";
import ShowLead from "../Components/Leads/ShowLead";
import Showstudents from "../Components/LeadStudents/Showstudents";
import Applyfreshstudent from "../Components/LeadStudents/Applyfreshstudent";
import UniversalLeadGenerator from "../Components/Leads/UniversalLeadGenerator";
import GenerateLead from "../Components/Leads/GenerateLead";
import SelectedProtectedRoute from "./SelectedProtectedRoute";

const router = createBrowserRouter([
  {
    path: "admin",
    element: <AdminMain />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <ProtectedRoute allowedRole="Admin" />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
            errorElement: <ErrorPage />,
          },
          {
            path: "universities",
            element: <AdminUniversity />,
            errorElement: <ErrorPage />,
          },
          {
            path: "departments",
            element: <AdminDepartments />,
            errorElement: <ErrorPage />,
          },
          {
            path: "programs",
            element: <AdminPrograms />,
            errorElement: <ErrorPage />,
          },
          {
            path: "syllabus",
            element: <AdminSyllabus />,
            errorElement: <ErrorPage />,
          },
          {
            path: "specialization",
            element: <AdminSpecialization />,
            errorElement: <ErrorPage />,
          },
          {
            path: "applications",
            element: <Applications />,
            errorElement: <ErrorPage />,
          },
          // {
          //   path: "update-application",
          //   element: <Applications />,
          //   errorElement: <ErrorPage />,
          // },
          {
            path: "new-application",
            element: <Freshapplication />,
            errorElement: <ErrorPage />,
          },
          {
            path: "update-student/:id",
            element: <AdminUpdateStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "re-register",
            element: <Reregister />,
            errorElement: <ErrorPage />,
          },
          {
            element: <SelectedProtectedRoute />,
            children: [
              {
                path: "lead-generate",
                element: <GenerateLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-lead",
                element: <ShowLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "prospectus-registration",
                element: <ProspReg />,
                errorElement: <ErrorPage />,
              },
              {
                path: "lead-application-form",
                element: <Applyfreshstudent />,
                errorElement: <ErrorPage />,
              },
              {
                path: "universal-lead-generator",
                element: <UniversalLeadGenerator />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-application-forms",
                element: <Showstudents />,
                errorElement: <ErrorPage />,
              },
            ],
          },
          {
            path: "settings",
            element: <AdminSettings />,
            errorElement: <ErrorPage />,
            children: [
              {
                path: "notify-info",
                element: <AdminNotifyWindow />,
                errorElement: <ErrorPage />,
              },
              {
                path: "courieer",
                element: <CourierCompany />,
                errorElement: <ErrorPage />,
              },
              {
                path: "notice",
                element: <Notice />,
                errorElement: <ErrorPage />,
              },
              {
                path: "email-template",
                element: <Emailtemplate />,
                errorElement: <ErrorPage />,
              },
              {
                path: "page-access",
                element: <Pageaccess />,
                errorElement: <ErrorPage />,
              },
              {
                path: "admission-type",
                element: <Admissiontype />,
                errorElement: <ErrorPage />,
              },
              {
                path: "mode",
                element: <Mode />,
                errorElement: <ErrorPage />,
              },
              {
                path: "course-type",
                element: <Programtype />,
                errorElement: <ErrorPage />,
              },
              {
                path: "schema",
                element: <Schema />,
                errorElement: <ErrorPage />,
              },
              {
                path: "admission-session",
                element: <Admissionsession />,
                errorElement: <ErrorPage />,
              },
              {
                path: "exam-session",
                element: <Examsession />,
                errorElement: <ErrorPage />,
              },
            ],
          },
          {
            path: "university-manager",
            element: <AdminUniversityManager />,
            errorElement: <ErrorPage />,
          },
          {
            path: "operations",
            element: <AdminOperations />,
            errorElement: <ErrorPage />,
          },
          {
            path: "counsellors",
            element: <AdminCounsellors />,
            errorElement: <ErrorPage />,
          },
          {
            path: "sub-counsellors",
            element: <AdminSubCounsellors />,
            errorElement: <ErrorPage />,
          },
          {
            path: "center-master",
            element: <AdminCenter_Master />,
            errorElement: <ErrorPage />,
          },
          {
            path: "center",
            element: <AdminCenter />,
            errorElement: <ErrorPage />,
          },
          {
            path: "sub-center",
            element: <AdminSubcenter />,
            errorElement: <ErrorPage />,
          },
          {
            path: "student",
            element: <AdminStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "center-ledger",
            element: <AdminCenterLedger />,
            errorElement: <ErrorPage />,
          },
          {
            path: "student-ledger",
            element: <AdminStudentLedger />,
            errorElement: <ErrorPage />,
          },
          {
            path: "offline-payment",
            element: <AdminOfflinePaymentStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "online-payment",
            element: <AdminOnlinePaymentStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "profile",
            element: <MyProfile />,
            errorElement: <ErrorPage />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
            errorElement: <ErrorPage />,
          },
          {
            path: "create-accountant",
            element: <AdminAccountant />,
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
  {
    path: "center",
    element: <CenterLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <ProtectedRoute allowedRole="center" />,
        children: [
          {
            element: <SelectedProtectedRoute />,
            children: [
              {
                path: "lead-generate",
                element: <GenerateLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-lead",
                element: <ShowLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "prospectus-registration",
                element: <ProspReg />,
                errorElement: <ErrorPage />,
              },
              {
                path: "lead-application-form",
                element: <Applyfreshstudent />,
                errorElement: <ErrorPage />,
              },
              {
                path: "universal-lead-generator",
                element: <UniversalLeadGenerator />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-application-forms",
                element: <Showstudents />,
                errorElement: <ErrorPage />,
              },
            ],
          },
          {
            path: "counsellors",
            element: <AdminCounsellors />,
            errorElement: <ErrorPage />,
          },
          {
            path: "sub-counsellors",
            element: <AdminSubCounsellors />,
            errorElement: <ErrorPage />,
          },
          {
            path: "update-student/:id",
            element: <AdminUpdateStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "profile",
            element: <MyProfile />,
            errorElement: <ErrorPage />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
            errorElement: <ErrorPage />,
          },
          {
            path: "dashboard",
            element: <CenterDashboard />,
            errorElement: <ErrorPage />,
          },
          {
            path: "applications",
            element: <Applications />,
            errorElement: <ErrorPage />,
          },
          {
            path: "new-application",
            element: <Freshapplication />,
            errorElement: <ErrorPage />,
          },
          {
            path: "re-register",
            element: <Reregister />,
            errorElement: <ErrorPage />,
          },
          {
            path: "sub-center",
            element: <AdminSubcenter />,
            errorElement: <ErrorPage />,
          },
          {
            path: "center-ledger",
            element: <AdminCenterLedger />,
            errorElement: <ErrorPage />,
          },
          {
            path: "student-ledger",
            element: <AdminStudentLedger />,
            errorElement: <ErrorPage />,
          },
          {
            path: "offline-payment",
            element: <AdminOfflinePaymentStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "online-payment",
            element: <AdminOnlinePaymentStudent />,
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
  {
    path: "sub-center",
    element: <SubcenterLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <ProtectedRoute allowedRole="subCenter" />,
        children: [
          {
            element: <SelectedProtectedRoute />,
            children: [
              {
                path: "lead-generate",
                element: <GenerateLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-lead",
                element: <ShowLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "prospectus-registration",
                element: <ProspReg />,
                errorElement: <ErrorPage />,
              },
              {
                path: "lead-application-form",
                element: <Applyfreshstudent />,
                errorElement: <ErrorPage />,
              },
              {
                path: "universal-lead-generator",
                element: <UniversalLeadGenerator />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-application-forms",
                element: <Showstudents />,
                errorElement: <ErrorPage />,
              },
            ],
          },
          {
            path: "dashboard",
            element: <SubcenterDashboard />,
            errorElement: <ErrorPage />,
          },
          {
            path: "applications",
            element: <Applications />,
            errorElement: <ErrorPage />,
          },
          {
            path: "new-application",
            element: <Freshapplication />,
            errorElement: <ErrorPage />,
          },
          {
            path: "update-student/:id",
            element: <AdminUpdateStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "re-register",
            element: <Reregister />,
            errorElement: <ErrorPage />,
          },
          {
            path: "profile",
            element: <MyProfile />,
            errorElement: <ErrorPage />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
            errorElement: <ErrorPage />,
          },
          ,
          {
            path: "center-ledger",
            element: <AdminCenterLedger />,
            errorElement: <ErrorPage />,
          },
          {
            path: "student-ledger",
            element: <AdminStudentLedger />,
            errorElement: <ErrorPage />,
          },
          {
            path: "offline-payment",
            element: <AdminOfflinePaymentStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "online-payment",
            element: <AdminOnlinePaymentStudent />,
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
  {
    path: "operational",
    element: <OperationalLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <ProtectedRoute allowedRole="operation-manager" />,
        children: [
          {
            element: <SelectedProtectedRoute />,
            children: [
              {
                path: "lead-generate",
                element: <GenerateLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-lead",
                element: <ShowLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "prospectus-registration",
                element: <ProspReg />,
                errorElement: <ErrorPage />,
              },
              {
                path: "lead-application-form",
                element: <Applyfreshstudent />,
                errorElement: <ErrorPage />,
              },
              {
                path: "universal-lead-generator",
                element: <UniversalLeadGenerator />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-application-forms",
                element: <Showstudents />,
                errorElement: <ErrorPage />,
              },
            ],
          },
          {
            path: "update-student/:id",
            element: <AdminUpdateStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "profile",
            element: <MyProfile />,
            errorElement: <ErrorPage />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
            errorElement: <ErrorPage />,
          },
          {
            path: "dashboard",
            element: <OperationalDashboard />,
            errorElement: <ErrorPage />,
          },
          {
            path: "applications",
            element: <Applications />,
            errorElement: <ErrorPage />,
          },
          {
            path: "new-application",
            element: <Freshapplication />,
            errorElement: <ErrorPage />,
          },
          {
            path: "departments",
            element: <AdminDepartments />,
            errorElement: <ErrorPage />,
          },
          {
            path: "programs",
            element: <AdminPrograms />,
            errorElement: <ErrorPage />,
          },
          {
            path: "specialization",
            element: <AdminSpecialization />,
            errorElement: <ErrorPage />,
          },
          {
            path: "counsellors",
            element: <AdminCounsellors />,
            errorElement: <ErrorPage />,
          },
          {
            path: "sub-counsellors",
            element: <AdminSubCounsellors />,
            errorElement: <ErrorPage />,
          },
          {
            path: "center-master",
            element: <AdminCenter_Master />,
            errorElement: <ErrorPage />,
          },
          {
            path: "center",
            element: <AdminCenter />,
            errorElement: <ErrorPage />,
          },
          {
            path: "center-ledger",
            element: <AdminCenterLedger />,
            errorElement: <ErrorPage />,
          },
          {
            path: "student-ledger",
            element: <AdminStudentLedger />,
            errorElement: <ErrorPage />,
          },
          {
            path: "offline-payment",
            element: <AdminOfflinePaymentStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "online-payment",
            element: <AdminOnlinePaymentStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "settings",
            element: <AdminSettings />,
            errorElement: <ErrorPage />,
            children: [
              {
                path: "courieer",
                element: <CourierCompany />,
                errorElement: <ErrorPage />,
              },
              {
                path: "notice",
                element: <Notice />,
                errorElement: <ErrorPage />,
              },
              {
                path: "email-template",
                element: <Emailtemplate />,
                errorElement: <ErrorPage />,
              },
              {
                path: "page-access",
                element: <Pageaccess />,
                errorElement: <ErrorPage />,
              },
              {
                path: "admission-type",
                element: <Admissiontype />,
                errorElement: <ErrorPage />,
              },
              {
                path: "mode",
                element: <Mode />,
                errorElement: <ErrorPage />,
              },
              {
                path: "program-type",
                element: <Programtype />,
                errorElement: <ErrorPage />,
              },
              {
                path: "schema",
                element: <Schema />,
                errorElement: <ErrorPage />,
              },
              {
                path: "admission-session",
                element: <Admissionsession />,
                errorElement: <ErrorPage />,
              },
              {
                path: "exam-session",
                element: <Examsession />,
                errorElement: <ErrorPage />,
              },
            ],
          },
          {
            path: "create-accountant",
            element: <AdminAccountant />,
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
  {
    path: "university-manager",
    element: <UniversityMLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <ProtectedRoute allowedRole="university-manager" />,
        children: [
          {
            element: <SelectedProtectedRoute />,
            children: [
              {
                path: "lead-generate",
                element: <GenerateLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-lead",
                element: <ShowLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "prospectus-registration",
                element: <ProspReg />,
                errorElement: <ErrorPage />,
              },
              {
                path: "lead-application-form",
                element: <Applyfreshstudent />,
                errorElement: <ErrorPage />,
              },
              {
                path: "universal-lead-generator",
                element: <UniversalLeadGenerator />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-application-forms",
                element: <Showstudents />,
                errorElement: <ErrorPage />,
              },
            ],
          },
          {
            path: "update-student/:id",
            element: <AdminUpdateStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "profile",
            element: <MyProfile />,
            errorElement: <ErrorPage />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
            errorElement: <ErrorPage />,
          },
          {
            path: "dashboard",
            element: <UniversityDashboard />,
            errorElement: <ErrorPage />,
          },
          {
            path: "applications",
            element: <Applications />,
            errorElement: <ErrorPage />,
          },
          {
            path: "new-application",
            element: <Freshapplication />,
            errorElement: <ErrorPage />,
          },
          {
            path: "departments",
            element: <AdminDepartments />,
            errorElement: <ErrorPage />,
          },
          {
            path: "programs",
            element: <AdminPrograms />,
            errorElement: <ErrorPage />,
          },
          {
            path: "specialization",
            element: <AdminSpecialization />,
            errorElement: <ErrorPage />,
          },
          {
            path: "counsellors",
            element: <AdminCounsellors />,
            errorElement: <ErrorPage />,
          },
          {
            path: "sub-counsellors",
            element: <AdminSubCounsellors />,
            errorElement: <ErrorPage />,
          },
          {
            path: "center",
            element: <AdminCenter />,
            errorElement: <ErrorPage />,
          },
          {
            path: "sub-center",
            element: <AdminSubcenter />,
            errorElement: <ErrorPage />,
          },
          {
            path: "student-ledger",
            element: <AdminStudentLedger />,
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
  {
    path: "accountant",
    element: <AccountantLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <ProtectedRoute allowedRole="Accountant" />,
        children: [
          {
            element: <SelectedProtectedRoute />,
            children: [
              {
                path: "lead-generate",
                element: <GenerateLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-lead",
                element: <ShowLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "prospectus-registration",
                element: <ProspReg />,
                errorElement: <ErrorPage />,
              },
              {
                path: "lead-application-form",
                element: <Applyfreshstudent />,
                errorElement: <ErrorPage />,
              },
              {
                path: "universal-lead-generator",
                element: <UniversalLeadGenerator />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-application-forms",
                element: <Showstudents />,
                errorElement: <ErrorPage />,
              },
            ],
          },
          {
            path: "update-student/:id",
            element: <AdminUpdateStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "dashboard",
            element: <AccountantDashboard />,
            errorElement: <ErrorPage />,
          },
          {
            path: "applications",
            element: <Applications />,
            errorElement: <ErrorPage />,
          },
          {
            path: "center-ledger",
            element: <AdminCenterLedger />,
            errorElement: <ErrorPage />,
          },
          {
            path: "student-ledger",
            element: <AdminStudentLedger />,
            errorElement: <ErrorPage />,
          },
          {
            path: "offline-payment",
            element: <AdminOfflinePaymentStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "online-payment",
            element: <AdminOnlinePaymentStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "profile",
            element: <MyProfile />,
            errorElement: <ErrorPage />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
  {
    path: "counsellor",
    element: <CounsellorLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <ProtectedRoute allowedRole="Counsellor" />,
        children: [
          {
            element: <SelectedProtectedRoute />,
            children: [
              {
                path: "lead-generate",
                element: <GenerateLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-lead",
                element: <ShowLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "prospectus-registration",
                element: <ProspReg />,
                errorElement: <ErrorPage />,
              },
              {
                path: "lead-application-form",
                element: <Applyfreshstudent />,
                errorElement: <ErrorPage />,
              },
              {
                path: "universal-lead-generator",
                element: <UniversalLeadGenerator />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-application-forms",
                element: <Showstudents />,
                errorElement: <ErrorPage />,
              },
            ],
          },
          {
            path: "re-register",
            element: <Reregister />,
            errorElement: <ErrorPage />,
          },
          {
            path: "new-application",
            element: <Freshapplication />,
            errorElement: <ErrorPage />,
          },
          {
            path: "update-student/:id",
            element: <AdminUpdateStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "dashboard",
            element: <CounsellorDashboard />,
            errorElement: <ErrorPage />,
          },
          {
            path: "applications",
            element: <Applications />,
            errorElement: <ErrorPage />,
          },
          {
            path: "sub-counsellors",
            element: <AdminSubCounsellors />,
            errorElement: <ErrorPage />,
          },
          {
            path: "profile",
            element: <MyProfile />,
            errorElement: <ErrorPage />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
  {
    path: "sub-counsellor",
    element: <SubcounsellorLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <ProtectedRoute allowedRole="subCounsellor" />,
        children: [
          {
            element: <SelectedProtectedRoute />,
            children: [
              {
                path: "lead-generate",
                element: <GenerateLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-lead",
                element: <ShowLead />,
                errorElement: <ErrorPage />,
              },
              {
                path: "prospectus-registration",
                element: <ProspReg />,
                errorElement: <ErrorPage />,
              },
              {
                path: "lead-application-form",
                element: <Applyfreshstudent />,
                errorElement: <ErrorPage />,
              },
              {
                path: "universal-lead-generator",
                element: <UniversalLeadGenerator />,
                errorElement: <ErrorPage />,
              },
              {
                path: "show-application-forms",
                element: <Showstudents />,
                errorElement: <ErrorPage />,
              },
            ],
          },
          {
            path: "new-application",
            element: <Freshapplication />,
            errorElement: <ErrorPage />,
          },
          {
            path: "update-student/:id",
            element: <AdminUpdateStudent />,
            errorElement: <ErrorPage />,
          },
          {
            path: "dashboard",
            element: <SubcounsellorDashboard />,
            errorElement: <ErrorPage />,
          },
          {
            path: "applications",
            element: <Applications />,
            errorElement: <ErrorPage />,
          },
          {
            path: "profile",
            element: <MyProfile />,
            errorElement: <ErrorPage />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
  {
    path: "forgot-password",
    element: <ForgetPassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: "otp-verification",
    element: <OtpVerification />,
    errorElement: <ErrorPage />,
  },
  {
    path: "",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
