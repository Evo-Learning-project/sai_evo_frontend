import { getTranslatedString as _ } from "@/i18n";
import { Event } from "@/models";
import { getExamPermalink, getFormattedTimestamp } from "@/utils";

export const examPublishedAnnouncementTemplate = (exam: Event) => `
<p>${_("announcements.exam_published_1")} ${exam.name}. ${_(
	"announcements.exam_published_2",
)} ${getFormattedTimestamp(exam.begin_timestamp ?? "")}. ${_(
	"announcements.exam_published_3",
)} <a href=${getExamPermalink(exam)}>${getExamPermalink(exam)}</a>.</p>
`;
