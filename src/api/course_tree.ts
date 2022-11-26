import { Course, CourseTreeNode, FileNode } from "@/models";
import { forceFileDownload } from "@/utils";
import axios from "axios";
import { convertPaginatedResponseToLocalPaginatedData } from "./converters";
import { PaginatedData } from "./interfaces";

export async function getCourseTopLevelNodes(
	courseId: string,
	pageNumber: number,
): Promise<PaginatedData<CourseTreeNode>> {
	const response = await axios.get(
		`/courses/${courseId}/nodes/?page=${pageNumber}&top_level=true`,
	);
	return convertPaginatedResponseToLocalPaginatedData(response.data, pageNumber);
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

// TODO create moveCourseNode

export async function getCourseRootNodeId(courseId: string): Promise<string> {
	const response = await axios.get(`/courses/${courseId}/nodes/root_id/`);
	return response.data;
}

export async function createCourseNode(
	courseId: string,
	node: CourseTreeNode,
): Promise<CourseTreeNode> {
	const response = await axios.post(`/courses/${courseId}/nodes/`, node);
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
	const response = await axios.delete(`/courses/${courseId}/nodes/`);
	return response.data;
}

export function getFileNodeUrl(courseId: string, nodeId: string): string {
	return `${axios.defaults.baseURL}/courses/${courseId}/nodes/${nodeId}/download/`;
}

export async function downloadFileNode(url: string): Promise<Blob> {
	const response = await axios.get(url, {
		responseType: "arraybuffer",
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
	const fileName = response.headers["content-disposition"]
		.split(/.*filename=(.*)/)[1]
		.replace(/"/g, "");
	forceFileDownload(response, fileName);
}
