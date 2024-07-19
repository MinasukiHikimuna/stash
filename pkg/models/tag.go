package models

type TagFilterType struct {
	OperatorFilter[TagFilterType]
	// Filter by tag name
	Name *StringCriterionInput `json:"name"`
	// Filter by tag aliases
	Aliases *StringCriterionInput `json:"aliases"`
	// Filter by tag favorites
	Favorite *bool `json:"favorite"`
	// Filter by tag description
	Description *StringCriterionInput `json:"description"`
	// Filter to only include tags missing this property
	IsMissing *string `json:"is_missing"`
	// Filter by number of scenes with this tag
	SceneCount *IntCriterionInput `json:"scene_count"`
	// Filter by number of images with this tag
	ImageCount *IntCriterionInput `json:"image_count"`
	// Filter by number of galleries with this tag
	GalleryCount *IntCriterionInput `json:"gallery_count"`
	// Filter by number of performers with this tag
	PerformerCount *IntCriterionInput `json:"performer_count"`
	// Filter by number of studios with this tag
	StudioCount *IntCriterionInput `json:"studio_count"`
	// Filter by number of groups with this tag
	GroupCount *IntCriterionInput `json:"group_count"`
	// Filter by number of movies with this tag
	MovieCount *IntCriterionInput `json:"movie_count"`
	// Filter by number of markers with this tag
	MarkerCount *IntCriterionInput `json:"marker_count"`
	// Filter by parent tags
	Parents *HierarchicalMultiCriterionInput `json:"parents"`
	// Filter by child tags
	Children *HierarchicalMultiCriterionInput `json:"children"`
	// Filter by StashID
	StashID *StringCriterionInput `json:"stash_id"`
	// Filter by StashID Endpoint
	StashIDEndpoint *StashIDCriterionInput `json:"stash_id_endpoint"`
	// Filter by number of parent tags the tag has
	ParentCount *IntCriterionInput `json:"parent_count"`
	// Filter by number f child tags the tag has
	ChildCount *IntCriterionInput `json:"child_count"`
	// Filter by autotag ignore value
	IgnoreAutoTag *bool `json:"ignore_auto_tag"`
	// Filter by related scenes that meet this criteria
	ScenesFilter *SceneFilterType `json:"scenes_filter"`
	// Filter by related images that meet this criteria
	ImagesFilter *ImageFilterType `json:"images_filter"`
	// Filter by related galleries that meet this criteria
	GalleriesFilter *GalleryFilterType `json:"galleries_filter"`
	// Filter by created at
	CreatedAt *TimestampCriterionInput `json:"created_at"`
	// Filter by updated at
	UpdatedAt *TimestampCriterionInput `json:"updated_at"`
}

type TagCreateInput struct {
	Name          string   `json:"name"`
	Description   *string  `json:"description"`
	Aliases       []string `json:"aliases"`
	IgnoreAutoTag *bool    `json:"ignore_auto_tag"`
	Favorite      *bool    `json:"favorite"`
	// This should be a URL or a base64 encoded data URL
	Image     *string   `json:"image"`
	StashIds  []StashID `json:"stash_ids"`
	ParentIds []string  `json:"parent_ids"`
	ChildIds  []string  `json:"child_ids"`
}

type TagUpdateInput struct {
	ID            string   `json:"id"`
	Name          *string  `json:"name"`
	Description   *string  `json:"description"`
	Aliases       []string `json:"aliases"`
	IgnoreAutoTag *bool    `json:"ignore_auto_tag"`
	Favorite      *bool    `json:"favorite"`
	// This should be a URL or a base64 encoded data URL
	Image     *string   `json:"image"`
	StashIds  []StashID `json:"stash_ids"`
	ParentIds []string  `json:"parent_ids"`
	ChildIds  []string  `json:"child_ids"`
}
