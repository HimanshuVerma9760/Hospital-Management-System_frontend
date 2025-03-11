import { ReactFormGenerator } from "react-form-builder2";

export default function EditForm({data}) {
  return (
    <>
      <ReactFormGenerator
        form_action="/submit-form"
        form_method="POST"
        task_id={1}
        data={data}
      />
    </>
  );
}
