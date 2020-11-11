import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProgrammingExerciseInstructionService, TestCaseState } from 'app/exercises/programming/shared/instructions-render/service/programming-exercise-instruction.service';
import { TaskArray } from 'app/exercises/programming/shared/instructions-render/task/programming-exercise-task.model';
import { ResultDetailComponent } from 'app/exercises/shared/result/result-detail.component';
import { ExerciseType } from 'app/entities/exercise.model';
import { Result } from 'app/entities/result.model';
import { getExercise } from 'app/entities/participation/participation.model';
import { ProgrammingExercise } from 'app/entities/programming-exercise.model';

@Component({
    selector: 'jhi-programming-exercise-instructions-step-wizard',
    templateUrl: './programming-exercise-instruction-step-wizard.component.html',
    styleUrls: ['./programming-exercise-instruction-step-wizard.scss'],
})
export class ProgrammingExerciseInstructionStepWizardComponent implements OnChanges {
    TestCaseState = TestCaseState;

    @Input() latestResult?: Result;
    @Input() tasks: TaskArray;
    @Input() showTestDetails?: boolean;

    steps: Array<{ done: TestCaseState; title: string; tests: string[] }>;

    constructor(private modalService: NgbModal, private instructionService: ProgrammingExerciseInstructionService) {}

    /**
     * Life cycle hook called by Angular to indicate that changes are detected.
     * @param changes - change that is detected.
     */
    ngOnChanges(changes: SimpleChanges): void {
        if ((changes.tasks && this.tasks) || (this.tasks && changes.latestResult)) {
            this.steps = this.tasks.map(({ taskName, tests }) => ({
                done: this.instructionService.testStatusForTask(tests, this.latestResult).testCaseState,
                title: taskName,
                tests,
            }));
        }
    }

    /**
     * Opens the ResultDetailComponent as popup; displays test results
     * @param {string[]} tests - Identifies the testcase
     */
    public showDetailsForTests(tests: string[]) {
        if (!this.latestResult || !this.latestResult.feedbacks) {
            return;
        }
        const {
            detailed: { failedTests, notExecutedTests },
        } = this.instructionService.testStatusForTask(tests, this.latestResult);
        if (failedTests.length + notExecutedTests.length <= 0) {
            return;
        }
        const modalRef = this.modalService.open(ResultDetailComponent, { keyboard: true, size: 'lg' });
        const componentInstance = modalRef.componentInstance as ResultDetailComponent;
        componentInstance.result = this.latestResult;
        componentInstance.feedbackFilter = tests;
        componentInstance.exerciseType = ExerciseType.PROGRAMMING;
        componentInstance.showTestDetails = this.showTestDetails || false;
    }
}
