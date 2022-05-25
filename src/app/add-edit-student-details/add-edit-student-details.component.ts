import { Component, ElementRef, Inject, OnInit} from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as constantData from '../../constantData/data';
import { Activity, Student } from '../models/student';

@Component({
  selector: 'app-add-edit-student-details',
  templateUrl: './add-edit-student-details.component.html',
  styleUrls: ['./add-edit-student-details.component.css']
})

export class AddEditStudentDetailsComponent implements OnInit{

  addActivities: Array<Activity> = [];
  studentDetails: Student;
  defaultDate = new Date();
  timings = constantData.data.timings;
  activities = constantData.data.activities;
  grades = constantData.data.grades;
  divisions = constantData.data.divisions;

  studentPersonalDetailsForm: FormGroup = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    grade: new FormControl('', Validators.required),
    division: new FormControl('', Validators.required),
    dob: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required)
  });

  ngOnInit() {
    if (this.studentDetails.activity && this.studentDetails.activity.length > 0) // Fetching existing activities if any.
      this.addActivities = this.studentDetails.activity;
    else          // Adding one mandatory activity card if there are no existing activities.
      this.addActivities.push({ selectedActivity: '', from: '', to: '' });
  }

  // initializing Student Details.
  constructor(
    public dialogRef: MatDialogRef<AddEditStudentDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public element: ElementRef) {
    if (this.data.data) { // If edit is clicked ==> existing data should be fetched.
      this.studentDetails = this.data.data;
      this.studentDetails.dob = new Date(this.studentDetails.dob);
    }
    else // If add is clicked ==> initializing data.
      this.studentDetails = { checked: false, firstname: '', lastname: '', division: '', grade: '', dob: '', gender: '', activity: [] };
  }

  // Add a new activity card.
  addActivity(event: any) {
    this.addActivities.push({ selectedActivity: '', from: '', to: '' });
  }

  // Removes an activity card.
  removeActivity(index: number) {
    this.addActivities.splice(index,1);
  }

  // Sets 'To' field when 'From' field is selected.
  changeFromTime(event: any,index:number) {
    let time:any = this.timings.find((x: any) => x.from == event.target.value);
    this.addActivities[index].to = time.to;
  }

  // Closes dialog box without making any changes.
  onCancel(): any {
    let students = JSON.parse(localStorage.getItem('studentDetails') || '{}');
    this.dialogRef.close(students);
  }

  // Filters the added activities and removes activities which are not completely filled.
  validateActivities():any {
   return this.addActivities.filter(x => x.selectedActivity && x.from);
  }

  // Updates/Adds to the existing data and closes the dialog box.
  saveStudentDetails() {
    this.addActivities = this.validateActivities();
    this.studentDetails.activity = this.addActivities;
    let students = JSON.parse(localStorage.getItem('studentDetails') || '{}');
    if (this.data.index>=0) // If editing a student.
      students[this.data.index] = this.studentDetails;
    else                    // If adding a student.
      students.push(this.studentDetails);
    localStorage.setItem('studentDetails', JSON.stringify(students));
    this.dialogRef.close(students);
  }
}
