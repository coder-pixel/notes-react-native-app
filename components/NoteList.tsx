import { View, FlatList } from "react-native";
import NoteItem from "./NoteItem";

type NoteListProps = {
  notes: any[];
  onDelete?: () => void;
  onEdit?: () => void;
};

const NoteList = ({ notes, onDelete, onEdit }: NoteListProps) => {
  return (
    <View>
      <FlatList
        data={notes}
        keyExtractor={(item) => item?.$id}
        renderItem={({ item }) => (
          <NoteItem note={item} onDelete={onDelete} onEdit={onEdit} />
        )}
      />
    </View>
  );
};

export default NoteList;
