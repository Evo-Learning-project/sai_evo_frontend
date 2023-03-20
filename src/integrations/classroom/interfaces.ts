export interface GoogleClassroomCourseData {
	id: string;
	name: string;
	alternateLink: string;
	enrollmentCode: string;
	description: string;
}

export interface GoogleClassroomCourseWorkData {
	id: string;
	courseId: string;
	scheduledTime: string;
	creationTime: string;
	title: string;
	description: string;
	alternateLink?: string;
}

export interface GoogleClassroomMaterialData {
	id: string;
	courseId: string;
	alternateLink?: string;
	title: string;
	description: string;
	state: string;
	creationTime: string;
	updateTime: string;
}

export interface GoogleClassroomAnnouncementData {
	id: string;
	courseId: string;
	text: string;
	alternateLink?: string;
	creationTime: string;
	updateTime: string;
}

export interface GoogleClassroomCourseTwin {
	course: string;
	remote_object_id: string;
	data: GoogleClassroomCourseData;
	enabled: boolean;
}

export interface GoogleClassroomCourseWorkTwin {
	course: string;
	remote_object_id: string;
	data: GoogleClassroomCourseWorkData;
}

export interface GoogleClassroomMaterialTwin {
	course: string;
	remote_object_id: string;
	data: GoogleClassroomCourseWorkData;
}

export interface GoogleClassroomAnnouncementTwin {
	course: string;
	remote_object_id: string;
	data: GoogleClassroomCourseWorkData;
}
