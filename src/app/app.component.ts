import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditStudentDetailsComponent } from './add-edit-student-details/add-edit-student-details.component';
import { Sort } from '@angular/material/sort';
import * as constantData from '../constantData/data';
import { DatePipe } from '@angular/common';
import { Student } from './models/student';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  students: Student[];
  sortedData: Student[];
  studentsToDelete: any = [];

  ngOnInit() {
  }

  // Initializing Table Data.
  constructor(public dialog: MatDialog, public datePipe: DatePipe) {
    let studentDetails = constantData.data.student;
    let localData = localStorage.getItem('studentDetails');
    if (localData == null) {
      localStorage.setItem('studentDetails', JSON.stringify(studentDetails));
      this.students = studentDetails;
    }
    else{
      this.students = JSON.parse(localStorage.getItem('studentDetails') || '{}');
    }
    this.students.forEach(x => x.dob=this.formatDate(x.dob));
    this.sortedData = this.students.slice();
  }

  // Sorting the table columns
  sortData(sort: Sort) {
    const data = this.students.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'firstname':
          return compare(a.firstname, b.firstname, isAsc);
        case 'grade':
          return compare(a.grade, b.grade, isAsc);
        case 'division':
          return compare(a.division, b.division, isAsc);
        case 'dob':
          return compare(a.dob.toString(), b.dob.toString(), isAsc);
        case 'gender':
          return compare(a.gender, b.gender, isAsc);
        default:
          return 0;
      }
    });
  }

  // Opens the dialog box.
  openDialog(index?: any): void {
    this.students.forEach(x => x.checked = false); // Unchecking the students if any on click of add/edit button.
    this.studentsToDelete = [];
    let data = this.students[index];
    let dialogRef = this.dialog.open(AddEditStudentDetailsComponent, {
      width: '650px',
      height:'565px',
      data: { data,index }
    });
    // Fetches data passed from dialog box after closing.
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result)  // If Save button is clciked in dialog box ==> Data should get updated in table, so setting the updated data).
        this.students = result;
      else  // If Cancel button is clicked in dialog box ==> Nothing should get updated in table, so setting the previous data).
        this.students = JSON.parse(localStorage.getItem('studentDetails') || '{}');
      this.students.forEach(x => x.dob = this.formatDate(x.dob));
      this.sortedData = this.students.slice();

      this.students.forEach(x => x.checked = false); // Unchecking the students if any after closing the dialog box.
      this.studentsToDelete = [];
    });
  }

  // Formats the date to 'MM/dd/yyyy' format.
  formatDate(dob: any):any {
    return this.datePipe.transform(dob, 'MM/dd/yyyy');
  }

  // Delete single student.
  deleteStudent(index: any) {
    this.students.splice(index, 1);
    this.sortedData = this.students.slice();
    this.studentsToDelete = this.students.filter(x => x.checked); // Re-calculating the checked students.
    localStorage.setItem('studentDetails', JSON.stringify(this.students));
  }

  // Deletes all selected students.
  deleteAll() {
    this.students = this.students?.filter(x => x.checked === false);
    this.sortedData = this.students.slice();
    localStorage.setItem('studentDetails', JSON.stringify(this.students));
    this.studentsToDelete = [];
  }

  // Finding all the selected students.
  onSelectStudent() {
    this.studentsToDelete = this.students.filter(x => x.checked);
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

