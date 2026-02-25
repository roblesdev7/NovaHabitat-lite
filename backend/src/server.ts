import { app } from './app';

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`NovaHabitat Lite running on port ${port}`);
});
