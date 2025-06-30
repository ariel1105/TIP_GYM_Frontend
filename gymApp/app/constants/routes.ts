import type { Route } from "expo-router";

export const Routes: Record<string, Route> = {
  Activities: "/(tabs)/activities",
  Enrollments: "/(tabs)/enrollments",
  Profile: "/(tabs)/profile",
  Home: "/(tabs)/home",
  Machines: "/(tabs)/machines",
  MyMachinePlan:"/(tabs)/myMachinePlan",
  Vouchers:"/(tabs)/vouchers",
  MyVouchers:"/(tabs)/myVouchers",
  Login: "/(auth)/login",
  Register: "/(auth)/register"
};
