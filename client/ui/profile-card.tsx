import { ProfileType } from '@/lib/types'
import React from 'react'

const ProfileCard = ({ profile }: { profile: ProfileType }) => {
  return (
    <div key={profile._id} className="p-4 border rounded-lg shadow">
      <h2 className="text-xl font-semibold">
        {profile.firstName} {profile.middleName} {profile.lastName}
      </h2>
      <p className="text-gray-600">Phone: {profile.phoneNumber}</p>
      <p className="text-gray-600">Email: {profile.email}</p>
    </div>
  )
}

export default ProfileCard