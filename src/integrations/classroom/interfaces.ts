export interface GoogleClassroomCourseData {
	id: string;
	name: string;
	alternateLink: string;
	enrollmentCode: string;
	description: string;
}

export interface GoogleClassroomCourseTwin {
	course: string;
	remote_object_id: string;
	data: GoogleClassroomCourseData;
	enabled: boolean;
}
