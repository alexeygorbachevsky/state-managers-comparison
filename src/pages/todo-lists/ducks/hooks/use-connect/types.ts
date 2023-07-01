import { DropResult } from "react-beautiful-dnd";
import { SortEnd, SortEvent, SortEventWithTag } from "react-sortable-hoc";

import { Todo } from "api/client";

export interface UseConnectReturn {
  onLoadTodos?: () => void;
  isFailed: boolean;
  todoIds: Todo["id"][];
  isLoading: boolean;
  onTaskDragEnd: (args: DropResult) => void;
  onShouldCancelStartDnD: (event: SortEvent | SortEventWithTag) => boolean;
  onSortEnd: (args: SortEnd) => void;
  isTodoCreating: boolean;
  isLastBatch: boolean;
}
