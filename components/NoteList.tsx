import { View, FlatList } from "react-native";
import NoteItem from "./NoteItem";

type NoteListProps = {
  notes: any[];
  onDelete?: any;
  onEdit?: any;
  loading: any;
};

const NoteList = ({ notes, onDelete, onEdit, loading }: NoteListProps) => {
  return (
    <View>
      <FlatList
        data={notes}
        keyExtractor={(item) => item?.$id}
        renderItem={({ item }) => (
          <NoteItem
            note={item}
            onDelete={onDelete}
            onEdit={onEdit}
            loading={loading}
          />
        )}
      />
    </View>
  );
};

export default NoteList;
