import {
	Course,
	CourseTreeNode,
	CourseTreeNodeType,
	FileNode,
	NodeComment,
	PollNode,
	PollNodeChoice,
	TopicNode,
} from "@/models";
import { forceFileDownload, getFileNameFromResponseHeader } from "@/utils";
import axios, { AxiosRequestConfig } from "axios";
import { convertPaginatedResponseToLocalPaginatedData } from "./converters";
import { BackendPaginatedResponse, PaginatedData } from "./interfaces";

export async function getCourseTopLevelNodes(
	courseId: string,
	pageNumber: number,
): Promise<PaginatedData<CourseTreeNode>> {
	const response = await axios.get(
		`/courses/${courseId}/nodes/?page=${pageNumber}&top_level=true`,
	);
	return convertPaginatedResponseToLocalPaginatedData(response.data, pageNumber);
}

export async function getCourseTopicNodes(courseId: string): Promise<TopicNode[]> {
	const response = await axios.get(
		`/courses/${courseId}/nodes/?page=1&resourcetype=${CourseTreeNodeType.TopicNode}&size=9999999`,
	);
	return convertPaginatedResponseToLocalPaginatedData(
		response.data as BackendPaginatedResponse<TopicNode>,
		1,
	).data;
}

export async function getCourseNode(
	courseId: string,
	nodeId: string,
): Promise<CourseTreeNode> {
	const response = await axios.get(`/courses/${courseId}/nodes/${nodeId}/`);
	return response.data;
}

export async function getNodeChildren(
	courseId: string,
	nodeId: string,
	pageNumber: number,
): Promise<PaginatedData<CourseTreeNode>> {
	const response = await axios.get(
		`/courses/${courseId}/nodes/${nodeId}/children/?page=${pageNumber}`,
	);
	return convertPaginatedResponseToLocalPaginatedData(response.data, pageNumber);
}

export async function moveCourseNode(
	courseId: string,
	nodeId: string,
	targetId: string,
	position: "first-child" | "last-child" | "left" | "right",
) {
	const response = await axios.post(
		`/courses/${courseId}/nodes/${nodeId}/move/?target=${targetId}&position=${position}`,
	);
	return response.data;
}

export async function getCourseRootNodeId(courseId: string): Promise<string> {
	const response = await axios.get(`/courses/${courseId}/nodes/root_id/`);
	return response.data;
}

export async function createCourseNode(
	courseId: string,
	node: CourseTreeNode,
	config?: AxiosRequestConfig,
): Promise<CourseTreeNode> {
	// use FormData if uploading a file together with the rest of the payload
	if (node.resourcetype === CourseTreeNodeType.FileNode && node.file !== null) {
		const formData = new FormData();
		Object.entries(node).forEach(([k, v]) => formData.append(k, v));
		const response = await axios.post(`/courses/${courseId}/nodes/`, formData, config);
		return response.data;
	}
	const response = await axios.post(`/courses/${courseId}/nodes/`, node, config);
	return response.data;
}

export async function partialUpdateCourseNode(
	courseId: string,
	nodeId: string,
	payload: Partial<CourseTreeNode>,
): Promise<CourseTreeNode> {
	const response = await axios.patch(`/courses/${courseId}/nodes/${nodeId}/`, payload);
	return response.data;
}

export async function uploadNodeFile(
	courseId: string,
	nodeId: string,
	file: Blob,
): Promise<FileNode> {
	const formData = new FormData();
	formData.append("file", file);
	const response = await axios.patch(`/courses/${courseId}/nodes/${nodeId}/`, formData);
	return response.data;
}

export async function deleteCourseNode(courseId: string, nodeId: string): Promise<void> {
	const response = await axios.delete(`/courses/${courseId}/nodes/${nodeId}/`);
	return response.data;
}

export function getFileNodeUrl(courseId: string, nodeId: string): string {
	return `${axios.defaults.baseURL}/courses/${courseId}/nodes/${nodeId}/download/`;
}

export async function downloadFileNode(
	url: string,
	onDownloadProgress?: (e: any) => void,
): Promise<ArrayBuffer> {
	const response = await axios.get(url, {
		responseType: "arraybuffer",
		...(onDownloadProgress ? { onDownloadProgress } : {}),
	});
	return response.data;
}

export async function downloadFileNodeAsAttachment(
	courseId: string,
	nodeId: string,
): Promise<void> {
	const response = await axios.get(`/courses/${courseId}/nodes/${nodeId}/download/`, {
		responseType: "arraybuffer",
	});
	const fileName = getFileNameFromResponseHeader(response.headers["content-disposition"]);
	// (
	// 	response.headers["content-disposition"].split(/.*filename=(.*)/)[1] ?? "filename"
	// ).replace(/"/g, "");
	forceFileDownload(response, fileName);
}

export async function getFileNodeThumbnail(
	courseId: string,
	nodeId: string,
): Promise<string> {
	const response = await axios.get(`/courses/${courseId}/nodes/${nodeId}/thumbnail/`, {
		responseType: "arraybuffer",
	});
	return response.data;
}

export async function getCourseNodeComments(
	courseId: string,
	nodeId: string,
): Promise<NodeComment[]> {
	const response = await axios.get(`/courses/${courseId}/nodes/${nodeId}/comments/`);
	return response.data;
}

export async function createCourseNodeComment(
	courseId: string,
	nodeId: string,
	comment: NodeComment,
): Promise<NodeComment> {
	const response = await axios.post(
		`/courses/${courseId}/nodes/${nodeId}/comments/`,
		comment,
	);
	return response.data;
}

export async function deleteCourseNodeComment(
	courseId: string,
	nodeId: string,
	commentId: string,
): Promise<void> {
	const response = await axios.delete(
		`/courses/${courseId}/nodes/${nodeId}/comments/${commentId}/`,
	);
	return response.data;
}

export async function createPollNodeChoice(
	courseId: string,
	nodeId: string,
	choice: PollNodeChoice,
): Promise<PollNodeChoice> {
	const response = await axios.post(
		`/courses/${courseId}/nodes/${nodeId}/choices/`,
		choice,
	);
	return response.data;
}

export async function partialUpdatePollNodeChoice(
	courseId: string,
	nodeId: string,
	choiceId: string,
	changes: Partial<PollNodeChoice>,
): Promise<PollNodeChoice> {
	const response = await axios.patch(
		`/courses/${courseId}/nodes/${nodeId}/choices/${choiceId}/`,
		changes,
	);
	return response.data;
}

export async function votePollNodeChoice(
	courseId: string,
	nodeId: string,
	choiceId: string,
	remove: boolean,
): Promise<PollNode> {
	const response = await (remove ? axios.delete : axios.put)(
		`/courses/${courseId}/nodes/${nodeId}/choices/${choiceId}/vote/`,
	);
	return response.data;
}

// export async function unvotePollNodeChoice(
// 	courseId: string,
// 	nodeId: string,
// 	choiceId: string,
// ): Promise<PollNode> {
// 	const response = await axios.delete(
// 		`/courses/${courseId}/nodes/${nodeId}/choices/${choiceId}/vote/`,
// 	);
// 	return response.data;
// }

export async function deletePollNodeChoice(
	courseId: string,
	nodeId: string,
	choiceId: string,
): Promise<void> {
	const response = await axios.delete(
		`/courses/${courseId}/nodes/${nodeId}/choices/${choiceId}/`,
	);
	return response.data;
}
