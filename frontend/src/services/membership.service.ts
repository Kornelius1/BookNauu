import axiosInstance from "@/api/axios";
import type {
    InviteAdminRequest,
    TeamMember,
} from "@/types/membership";

const BASE_URL = "/v1/business/team";

export const getTeamMembers = async (): Promise<TeamMember[]> => {
    const response = await axiosInstance.get<TeamMember[]>(BASE_URL);

    return response.data;
};

export const inviteAdmin = async (
    request: InviteAdminRequest
): Promise<void> => {
    await axiosInstance.post(
        `${BASE_URL}/invitations`,
        request
    );
};

export const removeMember = async (
    userId: number
): Promise<void> => {
    await axiosInstance.delete(
        `${BASE_URL}/${userId}`
    );
};