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
