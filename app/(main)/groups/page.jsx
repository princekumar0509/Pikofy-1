"use client";

import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarLoader } from "react-spinners";
import { PlusCircle, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GroupsPage() {
  const router = useRouter();
  const { data, isLoading } = useConvexQuery(api.groups.getGroupOrMembers);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <BarLoader width={"100%"} color="#36d7b7" />
      </div>
    );
  }

  const groups = data?.groups || [];

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl gradient-title">My Groups</h1>
            <p className="text-muted-foreground mt-2">
              Manage your expense groups and track shared costs
            </p>
          </div>
          <Button asChild>
            <Link href="/expenses/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Group
            </Link>
          </Button>
        </div>
      </div>

      {groups.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No groups yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first group to start splitting expenses with friends and family.
            </p>
            <Button asChild>
              <Link href="/expenses/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Group
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <Badge variant="secondary">
                    {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}
                  </Badge>
                </div>
                {group.description && (
                  <p className="text-sm text-muted-foreground">
                    {group.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full">
                  <Link href={`/groups/${group.id}`}>
                    View Group
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

