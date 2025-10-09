import React, { useEffect, useMemo, useState } from "react";
import { Steps, Select, Spin, Button, Row, Col, Card, Typography } from "antd";
import PropTypes from "prop-types";

const { Step } = Steps;
const { Text } = Typography;
const { Option } = Select;

export default function MultiStepSelectAsync({
  steps,
  initialValues = {},
  onFinish = () => {},
  nextText = "Next",
  prevText = "Back",
  finishText = "Finish",
}) {
  const [current, setCurrent] = useState(0);
  const [values, setValues] = useState(() => ({ ...initialValues }));
  const [options, setOptions] = useState(() => ({}));
  const [loading, setLoading] = useState(false);
  const step = steps[current];

  const loadForStep = async (stepKey, search = "") => {
    const s = steps.find((s) => s.key === stepKey);
    if (!s || typeof s.loadOptions !== "function") return;
    setLoading(true);
    try {
      const items = await s.loadOptions(search);
      setOptions((prev) => ({ ...prev, [stepKey]: Array.isArray(items) ? items : [] }));
    } catch {
      setOptions((prev) => ({ ...prev, [stepKey]: [] }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step) loadForStep(step.key, "");
  }, [current, step && step.key]);

  const onSelect = (stepKey, value) => {
    setValues((prev) => ({ ...prev, [stepKey]: value }));
  };

  const handleNext = () => {
    const val = values[step.key];
    if (val === undefined || val === null || val === "") return;
    if (current < steps.length - 1) setCurrent((c) => c + 1);
  };

  const handlePrev = () => setCurrent((c) => Math.max(0, c - 1));
  const handleFinish = () => onFinish(values);

  const renderStepContent = (s) => {
    const stepOptions = options[s.key] || [];
    return (
      <div style={{ marginTop: 12 }}>
        <Select
          showSearch
          placeholder={s.placeholder || Select }
          value={values[s.key]}
          onChange={(v) => onSelect(s.key, v)}
          onSearch={(val) => loadForStep(s.key, val)}
          notFoundContent={loading ? <Spin size="small" /> : <Text type="secondary">No options</Text>}
          filterOption={false}
          style={{ width: "100%" }}
          allowClear
        >
          {stepOptions.map((op) => (
            <Option key={op.value} value={op.value}>
              {op.label}
            </Option>
          ))}
        </Select>
      </div>
    );
  };

  const progress = useMemo(
    () => Math.round(((current + 1) / Math.max(1, steps.length)) * 100),
    [current, steps.length]
  );

  return (
    <Card>
      <Row gutter={16} align="middle">
        <Col flex="1 1 320px">
          <Steps current={current} direction="vertical" size="small">
            {steps.map((s) => (
              <Step key={s.key} title={s.title} description={s.subtitle} />
            ))}
          </Steps>
        </Col>

        <Col flex="2 1 420px">
          <div>
            <Text strong>{step.title}</Text>
            {step.description && (
              <div style={{ marginTop: 6 }}>
                <Text type="secondary">{step.description}</Text>
              </div>
            )}

            {renderStepContent(step)}

            <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <div style={{ marginRight: "auto", alignSelf: "center" }}>
                <Text type="secondary">Progress: {progress}%</Text>
              </div>

              <Button onClick={handlePrev} disabled={current === 0}>
                {prevText}
              </Button>

              {current < steps.length - 1 ? (
                <Button type="primary" onClick={handleNext}>
                  {nextText}
                </Button>
              ) : (
                <Button type="primary" onClick={handleFinish}>
                  {finishText}
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}

MultiStepSelectAsync.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      description: PropTypes.string,
      placeholder: PropTypes.string,
      loadOptions: PropTypes.func.isRequired,
    })
  ).isRequired,
  initialValues: PropTypes.object,
  onFinish: PropTypes.func,
  nextText: PropTypes.string,
  prevText: PropTypes.string,
  finishText: PropTypes.string,
};
