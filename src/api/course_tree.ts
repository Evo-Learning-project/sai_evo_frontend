import { CourseTreeNode } from "@/models";
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

export async function getNodeChildren(
	courseId: string,
	nodeId: string,
	pageNumber: number,
): Promise<PaginatedData<CourseTreeNode>> {
	const response = await axios.get(
		`/courses/${courseId}/nodes/${nodeId}/?page=${pageNumber}`,
	);
	return convertPaginatedResponseToLocalPaginatedData(response.data, pageNumber);
}