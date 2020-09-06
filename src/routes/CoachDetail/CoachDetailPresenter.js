import React from "react";
import styled from "styled-components";
import Helmet from "react-helmet";
import Loader from "../../components/Loader";
// import Table from "../../components/Table";

import {
  Layout,
  Breadcrumb,
  Input,
  Select,
  Button,
  Table,
  Tag,
  Space,
} from "antd";

const { Column } = Table;

const { Content } = Layout;
const { Option } = Select;

const Container = styled(Content)`
  display: flex;
  align-items: center;
  width: "100%";
  font-size: 16px;
  font-weight: bold;
  padding: 18px;
`;

const Div = styled.div`
  justify-content: flex-end;
  display: flex;
  margin-right: 30px;
  width: 100px;
`;

const Inputs = styled(Input)`
  width: 300px;
  height: 40px;
  padding: 15px 150px 18px 17px;
  line-height: 17px;
  font-size: 14px;
  color: #9b9b9b;
  border: none;
  border-radius: 0.4rem;
  transition: box-shadow 300ms;
`;

const Selects = styled(Select)`
  width: 300px;
  font-size: 14px;
  color: #9b9b9b;
  border: none;
  border-radius: 0.4rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 500px;
  justify-content: flex-end;
  margin-top: 15px;
`;

const IButton = styled(Button)``;

const CoachDetailPresenter = ({ page, coaches }) => (
  <>
    <Helmet>
      <title>코치 현황</title>
    </Helmet>

    <Content style={{ margin: "0 auto", width: 700 }}>
      <Breadcrumb style={{ margin: "30px 0" }}>
        <Breadcrumb.Item
          style={{
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          [ 코치 현황 ]
        </Breadcrumb.Item>
      </Breadcrumb>

      {coaches === undefined ? (
        <Loader />
      ) : (
        <Table
          dataSource={coaches}
          style={{ fontWeight: 600 }}
          pagination={{ pageSize: 8 }}
        >
          <Column title="이름" dataIndex="이름" key="이름" />
          <Column title="나이" dataIndex="나이" key="나이" />
          <Column title="연락처" dataIndex="연락처" key="연락처" />
          <Column
            title="수정"
            key="수정"
            render={(text, record) => (
              <Space size="middle">
                {console.log("text", text)}
                <a style={{ color: "#70a1ff" }}>수정</a>
                <a style={{ color: "#ff6b81" }}>삭제</a>
              </Space>
            )}
          />
        </Table>
      )}
    </Content>
  </>
);

export default CoachDetailPresenter;