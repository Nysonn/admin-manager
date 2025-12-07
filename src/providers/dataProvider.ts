import fakeDataProvider from "ra-data-fakerest";

export type Page = {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};

const now = new Date().toISOString();

const initialData: {
  pages: Page[];
  images: any[];
  menu: any[];
} = {
  pages: [
    {
      id: 1,
      title: "Welcome to admin-manager",
      slug: "welcome-to-admin-manager",
      content: "<p>This is a sample published page. Replace with real content.</p>",
      status: "published",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      title: "About Our Services",
      slug: "about-our-services",
      content: "<p>Draft page describing services.</p>",
      status: "draft",
      createdAt: now,
      updatedAt: now,
    },
  ],
  images: [
    {
      id: 1,
      filename: "placeholder.jpg",
      url: "https://via.placeholder.com/1280x720.png?text=Placeholder",
      thumbnailUrl: "https://via.placeholder.com/400.png?text=Thumb",
      size: 102400,
      width: 1280,
      height: 720,
      uploadedAt: now,
    },
  ],
  // Single menu record (we store the whole menu JSON as one entry with id=1)
  menu: [
    {
      id: 1,
      items: [
        {
          id: "m-1",
          label: "Home",
          linkType: "internal",
          pageId: 1,
          icon: "",
          openInNewTab: false,
          showInMobile: true,
          children: [],
        },
        {
          id: "m-2",
          label: "About",
          linkType: "internal",
          pageId: 2,
          icon: "",
          openInNewTab: false,
          showInMobile: true,
          children: [
            {
              id: "m-2-1",
              label: "Team",
              linkType: "external",
              url: "https://example.com/team",
              icon: "",
              openInNewTab: false,
              showInMobile: true,
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

const dataProvider = fakeDataProvider(initialData, true);
export default dataProvider;
