import React from "react";
import { connect } from "react-redux";
import DayLessonPresenter from "./DayLessonPresenter";

import { thunkGetMembers } from "../../redux/thunk/memberThnuk";
import { thunkGetCoaches } from "../../redux/thunk/coachThunk";
import {
  thunkRegisterLesson,
  thunkRegisterLessonCoach,
  thunkRegisterLessonMember,
  thunkGetLessons,
  thunkGetLessonDay,
  thunkGetLessonCoaches,
  thunkGetLessonMembers,
} from "../../redux/thunk/lessonThunk";

import { message } from "antd";
class DayLessonContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dayLessonInfo: {
        key: "",
        coaches: [],
        members: [],
        paid: "",
        attendance: "",
      },
      modalVisible: false,
      select: "",
      checkLesson: [],
      update: false,
      selectedRowKeys: [],
      lessonListKey: [],
      dayOfEng: {
        월요일: "MONDAY",
        화요일: "TUESDAY",
        수요일: "WEDNESDAY",
        목요일: "THURSDAY",
        금요일: "FRIDAY",
        토요일: "SATURDAY",
        일요일: "SUNDAY",
      },
      dayOfKor: {
        MONDAY: "월요일",
        TUESDAY: "화요일",
        WEDNESDAY: "수요일",
        THURSDAY: "목요일",
        FRIDAY: "금요일",
        SATURDAY: "토요일",
        SUNDAY: "일요일",
      },
      selectDay: "",
      lessons: [],
    };
  }

  componentDidMount = async () => {
    const {
      handleThunkGetCoaches,
      handleGetMembersInfo,
      handleThunkGetLessons,
      handleThunkGetLessonDay,
      match: { params },
    } = this.props;
    const { dayOfEng } = this.state;
    const { getDetailLessonInfo } = this;
    this.setState({
      selectDay: params.day,
    });

    const response = await handleThunkGetLessonDay(dayOfEng[params.day]);

    if (response !== undefined && response.status === 200) {
      const {
        data: { data },
      } = response;
      getDetailLessonInfo(data);
      this.setState({
        lessons: data,
        loading: true,
      });
    } else if (response === undefined) {
      this.setState({
        lessons: [],
        loading: true,
      });
    }
  };

  componentDidUpdate = async (prevProps) => {
    const {
      match: { params },
      handleThunkGetLessonDay,
    } = this.props;
    const { dayOfEng } = this.state;

    if (prevProps.match.params.day !== params.day) {
      const response = await handleThunkGetLessonDay(dayOfEng[params.day]);

      if (response !== undefined && response.status === 200) {
        const {
          data: { data },
        } = response;
        this.setState({
          lessons: data,
          loading: true,
        });
      } else if (response === undefined) {
        this.setState({
          lessons: [],
          loading: true,
        });
      }
      this.setState({
        selectDay: params.day,
      });
    }
  };

  getDetailLessonInfo = (data) => {
    const { handleThunkGetLessonCoaches } = this.props;
    const dataKey = [];
    for (let i = 0; i < data.length; i++) {
      handleThunkGetLessonCoaches(data[i].key);
    }
  };

  handleShowModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleChange = (e) => {
    const { lessonInfo } = this.state;
    const value = e.target.value;
    const inputName = e.target.name;
    this.setState({
      lessonInfo: {
        ...lessonInfo,
        [inputName]: value,
      },
    });
  };

  handleTimeChange = (time, timeString) => {
    const { lessonInfo } = this.state;

    const startTime = timeString[0];
    const endTime = timeString[1];
    this.setState({
      lessonInfo: {
        ...lessonInfo,
        schedules: [
          {
            ...lessonInfo.schedules[0],
            startTime: startTime,
            endTime: endTime,
          },
        ],
      },
    });
  };

  handleSelect = (name, value) => {
    const { lessonInfo, dayOfEng } = this.state;

    if (name === "dayOfWeek") {
      this.setState({
        lessonInfo: {
          ...lessonInfo,
          schedules: [
            {
              ...lessonInfo.schedules[0],
              dayOfWeek: dayOfEng[value],
            },
          ],
        },
      });
    } else {
      this.setState({
        lessonInfo: {
          ...lessonInfo,
          [name]: value,
        },
      });
    }
  };

  handleSubmit = async () => {
    const { lessonInfo } = this.state;
    const {
      lessons,
      handleThunkRegisterLesson,
      handleThunkRegisterLessonCoach,
      handleThunkRegisterLessonMember,
    } = this.props;

    let count = 0;

    for (const key in lessonInfo) {
      if (lessonInfo[key] === "") {
        message.error("레슨 정보를 입력해주세요");
        break;
      } else if (
        typeof lessonInfo[key] === "object" &&
        lessonInfo[key].length === 0
      ) {
        message.error("레슨 정보를 입력해주세요");
        break;
      } else {
        count = count + 1;
      }
    }

    if (count === 5) {
      message.success("레슨 등록");
      const {
        code,
        message: { id },
      } = await handleThunkRegisterLesson(lessonInfo);

      if (code === 200) {
        handleThunkRegisterLessonCoach(lessonInfo.coachKeys, id);
        handleThunkRegisterLessonMember(lessonInfo.memberKeys, id);
        this.setState({
          modalVisible: false,
          lessonInfo: {
            name: "",
            coachKeys: [],
            memberKeys: [],
            price: "",
            schedules: [
              {
                dayOfWeed: "",
                startTime: "",
                endTime: "",
              },
            ],
          },
        });
      } else {
        message.error("레슨 등록 실패");
        this.setState({
          modalVisible: false,
          lessonInfo: {
            name: "",
            coachKeys: [],
            memberKeys: [],
            price: "",
            schedules: [
              {
                dayOfWeed: "",
                startTime: "",
                endTime: "",
              },
            ],
          },
        });
      }
    }
  };

  handleCheckChange = (selectedRowKeys, selectedRows) => {
    if (selectedRows.length === 1) {
      this.setState({
        checkLesson: [...selectedRows],
        update: true,
        lessonInfo: selectedRows[0],
        selectedRowKeys: [...selectedRowKeys],
      });
    } else {
      this.setState({
        checkLesson: [...selectedRows],
        selectedRowKeys: [...selectedRowKeys],
      });
    }
  };

  handleDeleteLesson = () => {
    const { checkLesson } = this.state;
    const { handleDeleteLesson } = this.props;
    this.setState({
      checkLesson: [],
    });
    handleDeleteLesson(checkLesson);
  };

  handleUpdateLesson = () => {
    const { lessonInfo } = this.state;
    const { handleUpdateLesson } = this.props;

    let count = 0;

    for (const key in lessonInfo) {
      if (lessonInfo[key] === "" && key !== "lesson") {
        message.error("레슨 정보를 입력해주세요");
        break;
      } else {
        count = count + 1;
      }
    }

    if (count >= 4) {
      handleUpdateLesson(lessonInfo);
      message.success("레슨 수정");
      this.setState({
        modalVisible: false,
        lessonInfo: {
          name: "",
          coachKeys: [],
          memberKeys: [],
          price: "",
          schedules: [
            {
              dayOfWeed: "",
              startTime: "",
              endTime: "",
            },
          ],
        },
        checkLesson: [],
        selectedRowKeys: [],
      });
    }
  };

  render() {
    const {
      lessonInfo,
      loading,
      select,
      modalVisible,
      checkLesson,
      update,
      selectedRowKeys,
      dayOfKor,
      selectDay,
      lessons,
    } = this.state;
    const { members, coaches, days } = this.props;
    const {
      handleChange,
      handleSelect,
      handleSubmit,
      handleTimeChange,
      handleShowModal,
      handleCancel,
      handleCheckChange,
      handleDeleteLesson,
      handleUpdateLesson,
    } = this;
    console.log("test ", this.state);
    return (
      <DayLessonPresenter
        lessonInfo={lessonInfo}
        selectDay={selectDay}
        lessons={lessons}
        members={members}
        coaches={coaches}
        days={days}
        loading={loading}
        select={select}
        update={update}
        dayOfKor={dayOfKor}
        selectedRowKeys={selectedRowKeys}
        checkLesson={checkLesson}
        modalVisible={modalVisible}
        handleChange={handleChange}
        handleSelect={handleSelect}
        handleSubmit={handleSubmit}
        handleShowModal={handleShowModal}
        handleCancel={handleCancel}
        handleCheckChange={handleCheckChange}
        handleTimeChange={handleTimeChange}
        handleDeleteLesson={handleDeleteLesson}
        handleUpdateLesson={handleUpdateLesson}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // lessons: state.lessonReducer.lesson,
    members: state.memberReducer.members,
    coaches: state.coachReducer.coaches,
    days: state.lessonReducer.days,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleThunkGetLessonDay: (payload) => dispatch(thunkGetLessonDay(payload)),
    handleThunkGetLessonCoaches: (key) => dispatch(thunkGetLessonCoaches(key)),
    handleThunkGetLessonMembers: (key) => dispatch(thunkGetLessonMembers(key)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DayLessonContainer);
