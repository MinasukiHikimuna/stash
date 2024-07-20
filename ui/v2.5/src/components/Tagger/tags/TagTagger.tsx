import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { FormattedMessage, useIntl } from "react-intl";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import { useLocalForage } from "src/hooks/LocalForage";

import * as GQL from "src/core/generated-graphql";
import { LoadingIndicator } from "src/components/Shared/LoadingIndicator";
import { ConfigurationContext } from "src/hooks/Config";

import TagConfig from "./Config";
import { LOCAL_FORAGE_KEY, ITaggerConfig, initialConfig } from "../constants";
import { StashIDPill } from "src/components/Shared/StashID";

const CLASSNAME = "TagTagger";

interface ITagTaggerListProps {
  tags: GQL.TagDataFragment[];
  selectedEndpoint: { endpoint: string; index: number };
}

export const TagTaggerList: React.FC<ITagTaggerListProps> = ({
  tags,
  selectedEndpoint,
}) => {
  const [taggedTags, setTaggedTags] = useState<
    Record<string, Partial<GQL.SlimTagDataFragment>>
  >({});

  /*
  const handleTaggedTag = (
    tag: Pick<GQL.SlimTagDataFragment, "id"> &
      Partial<Omit<GQL.SlimTagDataFragment, "id">>
  ) => {
    setTaggedTags({
      ...taggedTags,
      [tag.id]: tag,
    });
  };
  */

  const renderTags = () =>
    tags.map((tag) => {
      const isTagged = taggedTags[tag.id];
      const stashID = tag.stash_ids.find((s) => {
        return s.endpoint === selectedEndpoint.endpoint;
      });

      let mainContent;
      if (!isTagged && stashID !== undefined) {
        mainContent = (
          <div className="text-left">
            <h5 className="text-bold">
              <FormattedMessage id="tag_tagger.tag_already_tagged" />
            </h5>
          </div>
        );
      }

      return (
        <div key={tag.id} className={`${CLASSNAME}-tag`}>
          <div></div>
          <div>
            <Card className="tag-card">
              <img loading="lazy" src={tag.image_path ?? ""} alt="" />
            </Card>
          </div>
          <div className={`${CLASSNAME}-details-text`}>
            <Link to={`/tags/${tag.id}`} className={`${CLASSNAME}-header`}>
              <h2>{tag.name}</h2>
            </Link>
            {mainContent}
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
        </div>
      );
    });

  return <Card>{renderTags()}</Card>;
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
