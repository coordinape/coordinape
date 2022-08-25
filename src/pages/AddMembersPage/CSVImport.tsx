import Papa from 'papaparse';

import DragFileUpload from '../../components/DragFileUpload';
import { useApeSnackbar } from '../../hooks';

import { NewMember } from './NewMemberList';

const CSVImport = ({
  addNewMembers,
}: {
  addNewMembers(newMembers: NewMember[]): void;
}) => {
  const { showError } = useApeSnackbar();

  const fileUploaded = async (file: File) => {
    const fileData = await file.text();
    const { data } = Papa.parse<string[]>(fileData);

    if (data.length > 0) {
      if (
        data[0][0]?.toLowerCase() == 'name' ||
        data[0][1]?.toLowerCase() == 'address' ||
        data[0][1]?.toLowerCase() == 'wallet'
      ) {
        // trim off the optional header row
        data.shift();
      }
    }
    // have to check length again because we shifted it

    const newMembers = data
      .filter(d => d.length == 2)
      .map(d => ({ name: d[0], address: d[1] }));

    if (newMembers.length == 0) {
      showError('No valid rows in the CSV');
    }
    addNewMembers(newMembers);
  };
  return <DragFileUpload fileUploaded={fileUploaded} />;
};

export default CSVImport;
