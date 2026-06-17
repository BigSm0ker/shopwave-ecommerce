import { apiService } from "@/services/api.service";
import type { UserProfile } from "@/models/user.model";

export const userService = {
  getProfile(): Promise<UserProfile> {
    return apiService.get<UserProfile>("/users/profile");
  },

  updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    return apiService.put<UserProfile>("/users/profile", profileData);
  },
};
