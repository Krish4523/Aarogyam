import React from "react";
import { ProfileForm } from "@/components/ProfileForm";

function ProfilePage() {
  return (
    <div className="max-w-4xl mr-auto">
      <h1 className="font-bold text-3xl my-4">Your Profile</h1>
      <ProfileForm />
    </div>
  );
}

export default ProfilePage;
