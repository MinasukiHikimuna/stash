import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FormattedMessage, useIntl } from "react-intl";
import { HashLink } from "react-router-hash-link";
import { useLocalForage } from "src/hooks/LocalForage";

import * as GQL from "src/core/generated-graphql";
import { LoadingIndicator } from "src/components/Shared/LoadingIndicator";
import { ConfigurationContext } from "src/hooks/Config";

import TagConfig from "./Config";
import { LOCAL_FORAGE_KEY, ITaggerConfig, initialConfig } from "../constants";
import { StashIDPill } from "src/components/Shared/StashID";

interface ITagTaggerListProps {
  tags: GQL.TagDataFragment[];
  selectedEndpoint: { endpoint: string; index: number };
}

export const TagTaggerList: React.FC<ITagTaggerListProps> = ({
  tags,
  selectedEndpoint,
}) => {
  return (
    <>
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
    </>
  );
};

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
    <div className="tagger-container mx-md-auto">
      {selectedEndpointIndex !== -1 && selectedEndpoint ? (
        <>
          <div className="row mb-2 no-gutters">
            <Button onClick={() => setShowConfig(!showConfig)} variant="link">
              {intl.formatMessage({ id: showHideConfigId })}
            </Button>
          </div>

          <TagConfig config={config} setConfig={setConfig} show={showConfig} />
          <TagTaggerList
            tags={tags}
            selectedEndpoint={{
              endpoint: selectedEndpoint.endpoint,
              index: selectedEndpointIndex,
            }}
          />
        </>
      ) : (
        <div className="my-4">
          <h3 className="text-center mt-4">
            <FormattedMessage id="tag_tagger.to_use_the_tag_tagger" />
          </h3>
          <h5 className="text-center">
            Please see{" "}
            <HashLink
              to="/settings?tab=metadata-providers#stash-boxes"
              scroll={(el) =>
                el.scrollIntoView({ behavior: "smooth", block: "center" })
              }
            >
              Settings.
            </HashLink>
          </h5>
        </div>
      )}
    </div>
  );
};
