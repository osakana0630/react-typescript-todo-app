import React, {useState, useEffect} from 'react';

interface AppProps {
  message?: string
}

interface Todo {
  id: number;
  value: string;
  completed: boolean;
  removed: boolean;
}

type Filter = "all" | "completed" | "uncompleted" | "removed"


const translatedFilter = (arg: Filter) => {
  switch (arg) {
    case 'all':
      return 'すべてのタスク';
    case 'completed':
      return '完了済みのタスク';
    case 'removed':
      return 'ごみ箱';
    case 'uncompleted':
      return '現在のタスク';
    default:
      return 'TODO';
  }
};

const App: React.VFC<AppProps> = () => {
  const [inputValue, setInputValue] = useState<string>("")
  const [todos, setTodos] = useState<Todo[]>([])
  const [filterType, setFilterType] = useState<Filter>("all")


  const filteredTodos = todos.filter((todo) => {
    switch (filterType) {
      case 'all':
        return !todo.removed;
      case 'completed':
        return todo.completed && !todo.removed;
      case 'uncompleted':
        return !todo.completed && !todo.removed;
      case 'removed':
        return todo.removed;
      default:
        return todo;
    }
  });


  // todos ステートを更新する関数
  const handleOnSubmit = (
    e: React.FormEvent<HTMLFormElement | HTMLInputElement>
  ) => {
    e.preventDefault();

    // 何も入力されていなかったらリターン
    if (!inputValue) return;

    // 新しい Todo を作成
    const newTodo: Todo = {
      id: todos.length + 1,
      value: inputValue,
      completed: false,
      removed: false,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo])
    setInputValue("")
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleOnEdit = (id: number, value: string): void => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.value = value;
      }
      return todo;
    });

    setTodos([...newTodos])
  }

  const handleOnCheck = (id: number, completed: boolean): void => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !completed;
      }
      return todo;
    });

    setTodos([...newTodos])
  }

  const handleOnDelete = (id: number, removed: boolean) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.removed = !removed;
      }
      return todo;
    });
    setTodos([...newTodos])
  }

  const handleOnEmpty = () => {
    const newTodos = todos.filter((todo) => !todo.removed);
    setTodos([...newTodos]);
  }

  useEffect(() => {
    document.title = `TODO: ${translatedFilter(filterType)}`;
  }, [filterType]);


  return (
    <div>
      <select
        defaultValue="all"
        onChange={(e) => setFilterType(e.target.value as Filter)}>
        <option value="all">{translatedFilter("all")}</option>
        <option value="completed">{translatedFilter("completed")}</option>
        <option value="uncompleted">{translatedFilter("uncompleted")}</option>
        <option value="removed">{translatedFilter("removed")}</option>
      </select>
      {filterType === "removed" ?
        <button onClick={handleOnEmpty} disabled={!filteredTodos.length}>ゴミ箱を空にする</button>
        :
        <form action="" onSubmit={handleOnSubmit}>
          <input type="text" value={inputValue} onChange={onChange} disabled={filterType === "completed"}/>
          <input type="submit" value="追加" onSubmit={handleOnSubmit} disabled={filterType === "completed"}/>
        </form>
      }
      <ul>
        {filteredTodos.map((todo, i) =>
          <li key={todo.id}>
            <input
              type="checkbox"
              disabled={todo.removed}
              checked={todo.completed}
              onChange={() => handleOnCheck(todo.id, todo.completed)}
            />
            <input
              type="text"
              value={todo.value}
              disabled={todo.removed || todo.completed}
              onChange={e => handleOnEdit(todo.id, e.target.value)}
            />
            <button onClick={() => handleOnDelete(todo.id, todo.removed)} disabled={!todo.completed}>
              {todo.removed ? "復元" : "削除"}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default App;
