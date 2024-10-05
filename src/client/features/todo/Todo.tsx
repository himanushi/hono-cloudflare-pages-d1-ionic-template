import {
  IonButton,
  IonCheckbox,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import { useTodo } from "./useTodo";

export const Todo = () => {
  const {
    todo,
    fetchNextPage,
    hasNextPage,
    addTodoMutation,
    updateTodoMutation,
    title,
    setTitle,
  } = useTodo();

  return (
    <IonList>
      <IonItem>
        <IonInput
          label="タイトル"
          placeholder="To-Do タイトル"
          value={title}
          onIonChange={(e) => setTitle(e.detail.value ?? "")}
        />
      </IonItem>
      <IonItem>
        <IonButton
          onClick={() => {
            if (title.trim()) {
              addTodoMutation.mutate({ title });
            }
          }}
        >
          To-Do 追加
        </IonButton>
      </IonItem>
      {todo.map((td) => (
        <IonItem key={td.id}>
          <IonCheckbox
            slot="start"
            checked={td.status === "completed"}
            onIonChange={(e) =>
              updateTodoMutation.mutate({
                id: td.id,
                completed: e.detail.checked,
              })
            }
          />
          <IonLabel>
            {td.id}: {td.title}
          </IonLabel>
        </IonItem>
      ))}
      {hasNextPage && (
        <IonItem>
          <IonButton
            onClick={() => {
              fetchNextPage();
            }}
          >
            Next
          </IonButton>
        </IonItem>
      )}
    </IonList>
  );
};
