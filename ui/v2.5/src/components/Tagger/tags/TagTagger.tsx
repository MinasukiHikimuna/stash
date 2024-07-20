import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useIntl } from "react-intl";
import { ConfigurationContext } from "src/hooks/Config";
import { useLocalForage } from "src/hooks/LocalForage";

import * as GQL from "src/core/generated-graphql";
import { LoadingIndicator } from "src/components/Shared/LoadingIndicator";

import TagConfig from "./Config";
import { LOCAL_FORAGE_KEY, ITaggerConfig, initialConfig } from "../constants";
import { StashIDPill } from "src/components/Shared/StashID";

interface ITaggerProps {
  tags: GQL.TagDataFragment[];
}

export const TagTagger: React.FC<ITaggerProps> = ({ tags }) => {
  const intl = useIntl();
  const { configuration: stashConfig } = React.useContext(ConfigurationContext);
  const [{ data: config }, setConfig] = useLocalForage<ITaggerConfig>(
    LOCAL_FORAGE_KEY,
    initialConfig
  );
  const [showConfig, setShowConfig] = useState(false);

  if (!config) return <LoadingIndicator />;

  const savedEndpointIndex =
    stashConfig?.general.stashBoxes.findIndex(
      (s) => s.endpoint === config.selectedEndpoint
    ) ?? -1;
  const selectedEndpointIndex =
    savedEndpointIndex === -1 && stashConfig?.general.stashBoxes.length
      ? 0
      : savedEndpointIndex;
  const selectedEndpoint =
    stashConfig?.general.stashBoxes[selectedEndpointIndex];

  const showHideConfigId = showConfig
    ? "actions.hide_configuration"
    : "actions.show_configuration";

  return (
    <div>
      <Button onClick={() => setShowConfig(!showConfig)} variant="link">
        {intl.formatMessage({ id: showHideConfigId })}
      </Button>
      <TagConfig config={config} setConfig={setConfig} show={showConfig} />
      {tags.map((tag) => (
        <div key={tag.id}>
          {tag.name}{" "}
          {tag.stash_ids
            .filter(
              (stash_id) => stash_id.endpoint === selectedEndpoint?.endpoint
            )
            .map((stash_id) => (
              <StashIDPill
                key={stash_id.stash_id}
                stashID={stash_id}
                linkType="tags"
              />
            ))}
        </div>
      ))}
    </div>
  );
};