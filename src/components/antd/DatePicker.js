import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/lib/date-picker/generatePicker";
import "antd/lib/date-picker/style/index";

const DatePicker = generatePicker(dayjsGenerateConfig);

export default DatePicker;
