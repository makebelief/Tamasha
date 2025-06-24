# Components Documentation

## Core Components

### AfroNavigation
Main navigation component that provides site-wide navigation.
```tsx
<AfroNavigation />
```
Features:
- Responsive mobile/desktop navigation
- Search integration
- User menu
- Theme switching

### FilmCard
Reusable card component for displaying movie/show information.
```tsx
<FilmCard
  title="Movie Title"
  posterPath="/path/to/poster"
  rating={8.5}
  releaseDate="2024-01-01"
/>
```

### FilmDetailsView
Detailed view for movie information.
```tsx
<FilmDetailsView id="movie-id" />
```
Features:
- Full movie details
- Cast information
- Similar movies
- Watch providers

### SeriesDetailsView
Detailed view for TV series information.
```tsx
<SeriesDetailsView id="series-id" />
```

## UI Components

### Buttons
```tsx
<Button variant="default">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
```

### Dialog
```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### Form Components
```tsx
<Input placeholder="Enter text" />
<Textarea placeholder="Enter long text" />
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

### Navigation Components
```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

## Utility Components

### Toast Notifications
```tsx
const { toast } = useToast()
toast({
  title: "Success",
  description: "Operation completed"
})
```

### Loading States
```tsx
<AfroSpinner />
```

### Modals
```tsx
<PreviewModal>
  <PreviewModalTrigger>
    <Button>Preview</Button>
  </PreviewModalTrigger>
  <PreviewModalContent>
    Content here
  </PreviewModalContent>
</PreviewModal>
``` 