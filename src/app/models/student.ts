export interface Activity {
  selectedActivity: string
  from: string;
  to: string;
}

export interface Student {
  checked: boolean;
  firstname: string;
  lastname: string;
  grade: string;
  division: string;
  dob: Date | string;
  gender: string;
  activity: Array<Activity>;
}
