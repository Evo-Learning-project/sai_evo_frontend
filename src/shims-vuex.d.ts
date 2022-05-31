import { SharedState, TeacherState, StudentState } from "./store/types";
import { Store } from "vuex";

declare module "@vue/runtime-core" {
  interface State {
    shared: SharedState;
    teacher: TeacherState;
    student: StudentState;
  }
  interface ComponentCustomProperties {
    $store: Store<State>;
    $sanitize: any;
  }
}
