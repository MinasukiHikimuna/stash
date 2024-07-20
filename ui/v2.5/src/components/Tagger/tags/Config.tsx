import React, { Dispatch } from "react";
import { Card, Collapse, Form } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import { ConfigurationContext } from "src/hooks/Config";

import { ITaggerConfig } from "../constants";

interface IConfigProps {
  show: boolean;
  config: ITaggerConfig;
  setConfig: Dispatch<ITaggerConfig>;
}

const Config: React.FC<IConfigProps> = ({ show, config, setConfig }) => {
  const { configuration: stashConfig } = React.useContext(ConfigurationContext);

  const handleInstanceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEndpoint = e.currentTarget.value;
    setConfig({
      ...config,
      selectedEndpoint,
    });
  };

  const stashBoxes = stashConfig?.general.stashBoxes ?? [];

  return (
    <Collapse in={show}>
      <Card>
        <div className="row">
          <h4 className="col-12">
            <FormattedMessage id="configuration" />
          </h4>
          <hr className="w-100" />
          <div className="col-md-6">
            <Form.Group
              controlId="stash-box-endpoint"
              className="align-items-center row no-gutters mt-4"
            >
              <Form.Label className="mr-4">
                <FormattedMessage id="studio_tagger.config.active_stash-box_instance" />
              </Form.Label>
              <Form.Control
                as="select"
                value={config.selectedEndpoint}
                className="col-md-4 col-6 input-control"
                disabled={!stashBoxes.length}
                onChange={handleInstanceSelect}
              >
                {!stashBoxes.length && (
                  <option>
                    <FormattedMessage id="studio_tagger.config.no_instances_found" />
                  </option>
                )}
                {stashConfig?.general.stashBoxes.map((i) => (
                  <option value={i.endpoint} key={i.endpoint}>
                    {i.endpoint}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
        </div>
      </Card>
    </Collapse>
  );
};

export default Config;
