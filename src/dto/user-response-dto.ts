import { User, Designation } from "@prisma/client"

type UserWithRelations = User & {
  designation: Designation
}

export function userResponseDTO(user: UserWithRelations) {
  return {
    id: user.id,
    first_name: user.first_name,
    army_name: user.army_name,
    graduation: user.graduation,
    email: user.email,
    role: user.role,
    om: user.om,

    designation: {
      id: user.designation.id,
      position: user.designation.position
    },

    createdAt: user.createdAt
  }
}