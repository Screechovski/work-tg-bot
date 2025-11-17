const LABELS = {
    discuss: "discus",
    onReview: "review",
    approved: "approve",
};

type MrUser = {
    id: number;
};

type MrInfoData = {
    event_type: string;
    user?: MrUser;
    object_attributes: {
        author_id: number;
        url: string;
    } & Record<string, unknown>;
    assignees?: MrUser[];
    reviewers?: MrUser[];
    merge_request?: {
        state: string;
    };
    changes:
        | {
              reviewers: {
                  previous: MrUser[];
                  current: MrUser[];
              };
          }
        | {
              labels: {
                  previous: { title: string }[];
                  current: { title: string }[];
              };
          }
        | {};
};

export type MrStatus = "approve" | "close_discusses" | "open_discusses" | "set_reviewer";

export function getMrStatus(mrInfoData: MrInfoData): {
    status: MrStatus;
    assigneGitId: number;
    actionGitId: number;
    reviewerGitId: number;
    mrLink: string;
    isDraft: boolean;
} | null {
    if (typeof mrInfoData !== "object" || mrInfoData == null) {
        return null;
    }

    const isComment = mrInfoData.event_type === "note";
    const isMR = mrInfoData.event_type === "merge_request";

    if (isComment || !isMR) {
        return null;
    }

    const isClosed = mrInfoData.merge_request?.state === "closed";

    if (isClosed) {
        return null;
    }

    const isDraft = !!mrInfoData.object_attributes?.draft;

    const mrLink = mrInfoData.object_attributes.url;
    const mrAuthorId = mrInfoData.object_attributes.author_id;

    const mrAssignerId = mrInfoData.assignees?.[0]?.id || mrAuthorId;
    const hookActionAuthorId = mrInfoData?.user?.id;
    const currentReviewerId = mrInfoData.reviewers?.[0]?.id;

    if (!hookActionAuthorId || !currentReviewerId) {
        return null;
    }

    let status: MrStatus | null = null;

    if ("reviewers" in mrInfoData.changes && mrInfoData.changes.reviewers.current?.length === 1) {
        status = "set_reviewer";
    } else if (mrInfoData.object_attributes.action === "open" && currentReviewerId) {
        status = "set_reviewer";
    } else if (
        "labels" in mrInfoData.changes &&
        mrInfoData.changes.labels.current?.find((l: { title: string }) => l.title === LABELS.discuss) &&
        currentReviewerId === hookActionAuthorId &&
        currentReviewerId
    ) {
        status = "open_discusses";
    } else if (
        "labels" in mrInfoData.changes &&
        !mrInfoData.changes.labels?.previous?.find((l: { title: string }) => l.title === LABELS.approved) &&
        mrInfoData.changes.labels?.current?.find((l: { title: string }) => l.title === LABELS.approved) &&
        currentReviewerId === hookActionAuthorId &&
        currentReviewerId
    ) {
        status = "approve";
    } else if (
        "labels" in mrInfoData.changes &&
        mrInfoData.changes.labels?.previous?.find((l: { title: string }) => l.title === LABELS.discuss) &&
        !mrInfoData.changes.labels?.current?.find((l: { title: string }) => l.title === LABELS.discuss) &&
        mrAssignerId === hookActionAuthorId
    ) {
        status = "close_discusses";
    }

    if (!status) {
        return null;
    }

    return {
        status,
        assigneGitId: mrAssignerId,
        actionGitId: hookActionAuthorId,
        reviewerGitId: currentReviewerId,
        isDraft,
        mrLink,
    };
}
