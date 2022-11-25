import { CourseTreeNode } from "@/models";
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
