import { MergeRequestInfo } from "./getMergeRequestInfo";

type MergeRequestStatus = "create" | "open_discusses" | "close_discusses" | "next_reviewer" | "approve";

export function getMergeRequestStatus(mrInfo: MergeRequestInfo): MergeRequestStatus | null {
    if (
        mrInfo.actionAuthorId === mrInfo.mrAuthorId &&
        !mrInfo.isApproved &&
        mrInfo.label === "" &&
        mrInfo.prevReviewerId === null
    ) {
        return "create";
    }

    if (mrInfo.actionAuthorId === mrInfo.reviewerId && mrInfo.label === "discus") {
        return "open_discusses";
    }

    if (mrInfo.actionAuthorId === mrInfo.mrAuthorId && mrInfo.label === "") {
        return "close_discusses";
    }

    if (mrInfo.actionAuthorId === mrInfo.prevReviewerId && mrInfo.isApproved && mrInfo.label === "") {
        return "next_reviewer";
    }

    if (mrInfo.actionAuthorId === mrInfo.reviewerId && mrInfo.isApproved && mrInfo.label === "approve") {
        return "approve";
    }

    return null;
}
