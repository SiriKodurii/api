const express = require('express');
const axios = require('axios');
const app = express();

app.get('/:formId/filteredResponses', async (req, res) => {
  try {
    const formId = req.params.formId;
    const filtersParam = req.query.filters;
    if (!filtersParam) {
      return res.status(400).json({ error: 'Filters parameter is missing' });
    }

    const filters = JSON.parse(filtersParam);
    
    const url = `https://api.fillout.com/v1/api/forms/cLZojxk94ous/submissions`;
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': 'Bearer sk_prod_TfMbARhdgues5AuIosvvdAC9WsA5kXiZlW8HZPaRDlIbCpSpLsXBeZO7dCVZQwHAY3P4VSBPiiC33poZ1tdUj2ljOzdTCCOSpUZ_3912'
      }
    });
    const { responses } = response.data;
    const filteredResponses = responses.filter(response => {
      console.log(responses)
      return filters.every(filter => {
        console.log(response.questions)
        const question = response.questions.find(question => question.id === filter.id);
        if (!question) return false;
        
        switch (filter.condition) {
          case 'equals':
            return question.value === filter.value;
          case 'does_not_equal':
            return question.value !== filter.value;
          case 'greater_than':
            return new Date(question.value) > new Date(filter.value);
          case 'less_than':
            return new Date(question.value) < new Date(filter.value);
          default:
            return false;
        }
      });
    });

    const totalResponses = filteredResponses.length;
    const pageCount = 1;

    res.json({ responses: filteredResponses, totalResponses, pageCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
