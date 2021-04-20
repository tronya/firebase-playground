import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {TodoModel} from '../models/todo.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {COLLECTIONS, GUID} from '../variables';
import {generateName} from '../helpers/nameGenerator';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  todos: Observable<TodoModel[]>;
  private todosCollection: AngularFirestoreCollection<TodoModel>;

  constructor(
    private afs: AngularFirestore,
    private snackBar: MatSnackBar) {
    this.todosCollection = afs.collection(COLLECTIONS.TODO);
    this.todos = this.todosCollection.valueChanges({idField: GUID});
    this.todos.subscribe(r => console.log(r));
  }

  // tslint:disable-next-line:typedef
  public addTodo() {
    const todo: TodoModel = {
      description: 'This is some description ' + new Date().getTime(),
      name: generateName(),
      valid: true,
      createdAt: Date.now()
    };
    this.todosCollection.add(todo).then((resp) => {
      console.log(resp);
      this.snackBar.open(`Saved ${todo.name}`, undefined, {
        duration: 3000
      });
    });
  }

  public removeTodo(todo: TodoModel): void {
    this.todosCollection.doc(todo.GUID).delete()
      .then(r => this.snackBar.open(`Deleted ${todo.name || todo.GUID}`, undefined, {
        duration: 3000
      }))
      .catch(e => console.log(e.message));
  }

  public ngOnInit(): void {
  }
}
