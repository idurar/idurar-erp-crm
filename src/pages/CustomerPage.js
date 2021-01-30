import React, { useRef, useState } from "react";
import DashboardLayout from "./layout/DashboardLayout";
import { Layout, Breadcrumb } from "antd";
import { DatePicker, TimePicker, Calendar } from "../antdcomponents";
import format from "dayjs";
const { Content } = Layout;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
function DaysPage() {
  function onChange(date, dateString) {
    console.log(date, dateString);
  }
  function onPanelChange(value, mode) {
    console.log(value, mode);
  }
  return (
    <DashboardLayout
      contentLayout={
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <div>
              <DatePicker onChange={onChange} />
              <br />
              <MonthPicker onChange={onChange} placeholder="Select month" />
              <br />
              <RangePicker onChange={onChange} />
              <br />
              <WeekPicker onChange={onChange} placeholder="Select week" />
            </div>
            <Calendar onPanelChange={onPanelChange} />
            <div>
              <TimePicker
                defaultValue={format("12:08:23", "HH:mm:ss")}
                size="large"
              />
              <TimePicker defaultValue={format("12:08:23", "HH:mm:ss")} />
              <TimePicker
                defaultValue={format("12:08:23", "HH:mm:ss")}
                size="small"
              />
            </div>
          </div>
        </Content>
      }
    />
  );
}

export default DaysPage;
