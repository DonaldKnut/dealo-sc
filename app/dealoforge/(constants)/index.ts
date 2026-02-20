export const sidebarLinks = [
  {
    imgURL: "/icons/forge-home.png",
    route: "/dealoforge/dashboard",
    label: "Home",
    roles: ["FREELANCER", "COMPANY", "JOB_SEEKER", "STUDENT", "INSTRUCTOR"], // All
  },
  {
    imgURL: "/icons/explore.png",
    route: "/dealoforge/dashboard/explore",
    label: "Explore",
    roles: ["FREELANCER", "JOB_SEEKER", "COMPANY", "INSTRUCTOR", "STUDENT"],
  },
  {
    imgURL: "/DEALO_ICON_white.png",
    route: "/dealoforge/dashboard/metrics",
    label: "Metrics",
    roles: ["FREELANCER", "COMPANY", "INSTRUCTOR", "STUDENT"],
  },
  {
    imgURL: "/icons/upgrade.png",
    route: "/dealoforge/dashboard/upgrade",
    label: "Upgrade",
    roles: ["FREELANCER", "JOB_SEEKER", "COMPANY", "STUDENT"],
  },
  {
    imgURL: "/icons/logout.png",
    route: "/sign-out",
    label: "Logout",
    roles: [
      "FREELANCER",
      "JOB_SEEKER",
      "COMPANY",
      "PATIENT",
      "STUDENT",
      "INSTRUCTOR",
    ],
  },
];

export const avatarImages = [
  "/images/avatar-1.jpeg",
  "/images/avatar-2.jpeg",
  "/images/avatar-3.png",
  "/images/avatar-4.png",
  "/images/avatar-5.png",
];
