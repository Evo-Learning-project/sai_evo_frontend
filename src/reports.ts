import { getTranslatedString as _ } from "./i18n/index";
import { EventParticipationState, EventTemplateRule } from "./models";
import {
  EventParticipation,
  EventParticipationSlot,
  Exercise,
  ExerciseChoice,
  Event,
} from "./models/interfaces";

export interface DataFrequency<T> {
  datum: T;
  frequency: number;
}

export enum ExamStatsTabs {
  OVERALL,
  EXERCISES,
}

export const getParticipationsAverageProgress = (
  participations: EventParticipation[],
  event: Event
) => {
  if (!participations?.length) {
    return 0;
  }
  const divisor =
    (event.template?.rules as EventTemplateRule[])
      .map((r) => r.amount)
      .reduce((a, b) => a + b, 0) * participations.length;

  const perc =
    (100 *
      participations
        .map((p) =>
          p.state === EventParticipationState.TURNED_IN
            ? p.slots.length
            : p.current_slot_cursor ?? 0
        )
        .reduce((a, b) => a + b)) /
    divisor;
  return Math.round(perc * 100) / 100;
};

// given an array of participations to an event, returns an array of exercises
// where each member has been assigned to a slot in at least one participation
export const getExerciseListFromParticipations = (
  participations: EventParticipation[]
): Exercise[] =>
  participations
    .flatMap((p) => p.slots)
    .map((s) => s.exercise)
    .filter((e, i, a) => a.findIndex((o) => o?.id == e?.id) === i); // eliminate duplicates

// returns an array of pairs <s, f> where s is a score and f is the
// frequency with which that score appears among the given participations
export const getScoreFrequencyFromParticipations = (
  participations: EventParticipation[]
): DataFrequency<string>[] =>
  (
    participations
      .filter((p) => typeof p.score !== "undefined" && p.score !== null)
      .map((p) => p.score) as string[]
  ).reduce((a, s) => {
    const normalizedDatum = String(isNaN(parseFloat(s)) ? s : parseFloat(s));
    const record = a.find((r) => r.datum == normalizedDatum);
    if (record) {
      record.frequency++;
    } else {
      a.push({ datum: normalizedDatum, frequency: 1 });
    }
    // put numbers first, in ascending order; then non-numeric
    // values in ascending lexicographical order
    return a.sort((a, b) =>
      isNaN(parseFloat(a.datum))
        ? isNaN(parseFloat(b.datum))
          ? a.datum < b.datum
            ? -1
            : 1
          : -1
        : isNaN(parseFloat(b.datum))
        ? isNaN(parseFloat(a.datum))
          ? a.datum < b.datum
            ? -1
            : 1
          : -1
        : parseFloat(a.datum) < parseFloat(b.datum)
        ? -1
        : 1
    );
  }, [] as DataFrequency<string>[]);

export const getChoiceSelectionFrequencyFor = (
  exercise: Exercise,
  slots: EventParticipationSlot[]
): DataFrequency<ExerciseChoice>[] =>
  slots
    .flatMap((s) => s.selected_choices)
    .reduce((a, c) => {
      const choice = (exercise.choices ?? []).find(
        (ch) => ch.id == c
      ) as ExerciseChoice;
      const record = a.find((r) => r.datum.id == c);
      if (record) {
        record.frequency++;
      } else {
        a.push({ datum: choice, frequency: 1 });
      }
      return a.sort((a, b) =>
        String(a.datum.id) < String(b.datum.id) ? -1 : 1
      );
    }, [] as DataFrequency<ExerciseChoice>[]);

export const scoreChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: true,
      grid: { display: false },
      title: {
        display: true,
        text: _("event_participation_headings.grade"),
      },
    },
    y: {
      display: true,
      grid: { display: true },
      ticks: { stepSize: 2, beginAtZero: true },
    },
  },
};

export const exerciseChoicesBarChartOptions = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: true,
      grid: { display: false },
      ticks: { stepSize: 2, beginAtZero: true },
      title: {
        display: true,
        text: _("event_stats.selections"),
      },
    },
    y: {
      display: true,
      grid: { display: false },
      //ticks: { font: { size: 22 } },
    },
  },
};

export const scoreChartDatasetSettings = {
  backgroundColor: "#303f9fb3",
  maxBarThickness: 100,
};

export const exerciseChoiceDatasetSettings = {
  backgroundColor: "#10B981b3",
  maxBarThickness: 40,
};

// strips html off the given string as chart.js doesn't support html in labels,
// and breaks longer texts into multiple lines
export const makeLabelText = (text: string): string | string[] => {
  const processedText = text
    .replace(/(<([^>]+)>)/gi, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  const MAX_LINE_LENGTH = 100;

  const LINE_LENGTH =
    processedText.length > MAX_LINE_LENGTH ||
    processedText.length < MAX_LINE_LENGTH / 1.5
      ? MAX_LINE_LENGTH
      : Math.ceil(processedText.length / 2);

  if (processedText.length < LINE_LENGTH) {
    return processedText;
  }
  // try to break at a point that makes the lines balanced in length
  // and break when encountering a space to avoid warping mid-word
  const breakPivot =
    processedText.length > MAX_LINE_LENGTH * 2
      ? LINE_LENGTH
      : Math.floor(processedText.length / 2);
  const breakFirstLineAt = findNearestSpace(processedText, breakPivot);

  const remaining = processedText.slice(breakFirstLineAt);

  if (remaining.length <= LINE_LENGTH) {
    // two lines are enough, no need to break text into a third line
    return [processedText.slice(0, breakFirstLineAt), remaining];
  }

  const breakSecondLineAt = findNearestSpace(remaining, LINE_LENGTH);

  return [
    processedText.slice(0, breakFirstLineAt),
    remaining.slice(0, breakSecondLineAt),
    remaining.slice(breakSecondLineAt, LINE_LENGTH + breakSecondLineAt) +
      (remaining.slice(breakSecondLineAt).length > LINE_LENGTH ? "..." : ""),
  ];
};

const findNearestSpace = (text: string, index: number): number => {
  let i = 0;
  while (i < text.length) {
    if (text.charAt(index - i) === " ") {
      return index - i;
    }
    if (text.charAt(index + i) === " ") {
      return index + i;
    }
    i++;
  }
  return -1;
};
