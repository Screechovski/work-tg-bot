import { User } from "../db/models";

const MR_STATUSES = [
    "open_waiting_reviewer", // мр создан, поставлен ревьюер (поставил ревьюера)
    "waiting_owner", // ревьюер сделал ревью и оставил дискусы, поставил тэг дискус (поставил тег дискус)
    "waiting_reviewer", // овнер поправил дискусы  (убрал тег дискус)
    "approved",
];

// текущий ревьюер

// мр создан, поставлен ревьюер (поставил ревьюера)
// ревьюер сделал ревью и оставил дискусы, поставил тэг дискус (поставил тег дискус)
// овнер поправил дискусы  (убрал тег дискус)
// ревьюер апрувнул, и сменил ревьюера
// лейбл апрув

interface ObjectAttributes {
    url: string;
    action: string | "approved";
    labels?: {
        title: string;
    }[];
}

interface User {
    username: string;
}

type MergeRequestNativeCommon = {
    user: User;
    object_attributes: ObjectAttributes;
    changes: any;
};

type MergeRequestNative =
    | ({
          object_kind: "merge_request";
          event_type: "merge_request";
          reviewers: {
              username: string;
          }[];
      } & MergeRequestNativeCommon)
    | ({
          object_kind: "note";
          event_type: "note";
      } & MergeRequestNativeCommon);

interface MergeRequest {
    reviewer: string;
    labels: string[];
    owner: string;
    project: string;
    mergeRequestLink: string;
}

export function getDataFromMergeRequest(data: MergeRequestNative): MergeRequest {
    console.clear();
    console.log("all:::::::::   ", JSON.stringify(data));
    console.log("changes:::::   ", JSON.stringify(data.changes));
    const reviewer = data.object_kind === "merge_request" ? data.reviewers[0]?.username || "" : "";

    return {
        reviewer,
        labels: (data.object_attributes.labels ?? []).map((label) => label.title),
        owner: data.user.username,
        project: "",
        mergeRequestLink: data.object_attributes.url,
    };
}

export async function getStatusFromMergeRequest(data: any): Promise<string | null> {
    try {
        console.log(JSON.stringify(data));
        console.log("data?.changes?.labels", data?.changes?.labels?.current);
        console.log("data?.changes?.reviewers?.current", data?.changes?.reviewers?.current);

        if (data?.changes?.reviewers?.current?.length) {
            const gitId = data?.reviewers?.[0]?.username;

            if (gitId) {
                const user = await User.findOne({ where: { gitId } });

                if (user) {
                    return `@${user.tgId} тебе на ревью прилетела задачка - ${data.object_attributes.url}`;
                }
            }
        }

        if (data?.changes?.labels?.current[0]?.title === "discus") {
            // TODO надо добавить проверку на ревьюера и автора лейбла discus,
            // если они разные то продумать вывод сообщения
            // const gitId = data?.user.username;
            const gitId = data?.reviewers?.[0]?.username;

            if (gitId) {
                const user = await User.findOne({ where: { gitId } });

                if (user) {
                    return `@hz \n тебе @${user.tgId} оставил комменты \n ${data.object_attributes.url}`;
                }
            }
        }
    } catch (error) {
        console.warn(error);
    }

    return null;
}
