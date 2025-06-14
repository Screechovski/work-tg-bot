export type MergeRequestInfo = {
    reviewerId: null | string;
    prevReviewerId: null | string;
    actionAuthorId: string;
    mrAuthorId: string;
    isApproved: boolean;
    prevLabel: "approve" | "discus" | "review" | "";
    label: "approve" | "discus" | "review" | "";
    link: string;
};

export function getMergeRequestInfo(data: any): MergeRequestInfo {
    let label: MergeRequestInfo["label"] = "";

    if (data.labels && data.labels.length === 1) {
        label = data.labels[0].title as "approve" | "discus" | "review";
    }

    return {
        prevReviewerId: null,
        reviewerId: "string;",
        actionAuthorId: "string;",
        mrAuthorId: "string;",
        isApproved: true,
        label,
        prevLabel: label,
        link: data.object_attributes.url,
    };
}
