import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
    MoreHorizontal,
    Plus,
    Users,
    UserMinus,
    Loader2,
} from "lucide-react";

import {
    getTeamMembers,
    inviteAdmin,
    removeMember,
} from "@/services/membership.service";

import type { TeamMember } from "@/types/membership";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Badge } from "@/components/ui/badge";

export default function MembershipPage() {

    const { business } = useAuth();
    const isOwner = business?.role === "OWNER";
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);

    const [removeMemberData, setRemoveMemberData] =
        useState<TeamMember | null>(null);

    const [removeLoading, setRemoveLoading] = useState(false);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getTeamMembers();

            setMembers(data);
        } catch (err) {
            console.error(err);

            setError("Failed to load team members.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleInviteAdmin = async () => {
        if (!inviteEmail.trim()) {
            setInviteError("Email is required.");
            return;
        }

        try {
            setInviteLoading(true);
            setInviteError(null);

            await inviteAdmin({
                email: inviteEmail.trim(),
            });

            setInviteEmail("");
            setInviteOpen(false);
        } catch (err) {
            console.error(err);

            setInviteError(
                "Failed to send invitation. Please try again."
            );
        } finally {
            setInviteLoading(false);
        }
    };

    const handleRemoveMember = async () => {
        if (!removeMemberData) {
            return;
        }

        try {
            setRemoveLoading(true);

            await removeMember(removeMemberData.userId);

            setMembers((currentMembers) =>
                currentMembers.filter(
                    (member) =>
                        member.userId !== removeMemberData.userId
                )
            );

            setRemoveMemberData(null);
        } catch (err) {
            console.error(err);

            setError("Failed to remove team member.");
        } finally {
            setRemoveLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Membership
                    </h1>

                    <p className="text-muted-foreground">
                        Manage your business team members.
                    </p>
                </div>
                {isOwner && (
                <Dialog
                    open={inviteOpen}
                    onOpenChange={(open) => {
                        setInviteOpen(open);

                        if (!open) {
                            setInviteEmail("");
                            setInviteError(null);
                        }
                    }}
                >
                    <DialogTrigger className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90">
                        <Plus className="h-4 w-4" />
                        Invite Admin
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Invite Admin
                            </DialogTitle>

                            <DialogDescription>
                                Send an invitation to add a new
                                administrator to your business.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-2 py-4">
                            <Label htmlFor="admin-email">
                                Email
                            </Label>

                            <Input
                                id="admin-email"
                                type="email"
                                placeholder="admin@example.com"
                                value={inviteEmail}
                                onChange={(event) =>
                                    setInviteEmail(
                                        event.target.value
                                    )
                                }
                            />

                            {inviteError && (
                                <p className="text-sm text-destructive">
                                    {inviteError}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setInviteOpen(false)
                                }
                                disabled={inviteLoading}
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={handleInviteAdmin}
                                disabled={inviteLoading}
                            >
                                {inviteLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}

                                Send Invitation
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                )}
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Team Members
                            </CardTitle>

                            <CardDescription>
                                Members who have access to this business.
                            </CardDescription>
                        </div>

                        {!loading && (
                            <Badge variant="secondary">
                                {members.length}{" "}
                                {members.length === 1
                                    ? "member"
                                    : "members"}
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-sm text-destructive">
                                {error}
                            </p>

                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={fetchMembers}
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : members.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Users className="mb-3 h-10 w-10 text-muted-foreground" />

                            <h3 className="font-medium">
                                No team members
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                There are no members in this business.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b text-left">
                                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                                        Member
                                    </th>

                                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                                        Email
                                    </th>

                                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                                        Role
                                    </th>

                                    <th className="w-12 px-4 py-3" />
                                </tr>
                                </thead>

                                <tbody>
                                {members.map((member) => (
                                    <tr
                                        key={member.userId}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="font-medium">
                                                {member.fullName}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-sm text-muted-foreground">
                                            {member.email}
                                        </td>

                                        <td className="px-4 py-4">
                                            <Badge
                                                variant={
                                                    member.role ===
                                                    "OWNER"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {member.role}
                                            </Badge>
                                        </td>

                                        <td className="px-4 py-4 text-right">
                                            {isOwner && member.role !==
                                                "OWNER" && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Open member actions</span>
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() =>
                                                                    setRemoveMemberData(
                                                                        member
                                                                    )
                                                                }
                                                            >
                                                                <UserMinus className="mr-2 h-4 w-4" />
                                                                Remove member
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog
                open={!!removeMemberData}
                onOpenChange={(open) => {
                    if (!open && !removeLoading) {
                        setRemoveMemberData(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Remove member?
                        </DialogTitle>

                        <DialogDescription>
                            Are you sure you want to remove{" "}
                            <span className="font-medium text-foreground">
                                {removeMemberData?.fullName}
                            </span>{" "}
                            from this business?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setRemoveMemberData(null)
                            }
                            disabled={removeLoading}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={handleRemoveMember}
                            disabled={removeLoading}
                        >
                            {removeLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}

                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}