import {HttpClient} from "@angular/common/http";
import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl} from "@angular/forms";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {TuiDialogContext} from "@taiga-ui/core";
import {TuiFileLike} from "@taiga-ui/kit";
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import {Subject} from "rxjs";
import {User} from "../../../domain/user.model";

@UntilDestroy()
@Component({
  selector: 'app-file-input-modal',
  templateUrl: './file-input-modal.component.html',
  styleUrls: ['./file-input-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputModalComponent {

  control = new FormControl();
  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<any>,
    private readonly http: HttpClient,
  ) {
  }

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
    this.control.setValue(null);
  }

  clearRejected(): void {
    this.removeFile();
    this.rejectedFiles$.next(null);
  }

  submit(): void {
    if (this.control.value !== null) {
      let fd = new FormData();
      fd.append('file', this.control.value);
      this.http.post(this.context.data, fd).pipe(untilDestroyed(this)).subscribe(value => {
        this.context.completeWith(value);
      });
    }
  }

}
