import { useParams } from 'react-router-dom';
import CalculatorView from '../components/calculator/CalculatorView';

export default function Calculator() {
  const { orgSlug, calcSlug } = useParams<{ orgSlug: string; calcSlug: string }>();

  if (!orgSlug || !calcSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid calculator URL</h2>
          <p className="text-gray-600">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  return <CalculatorView orgSlug={orgSlug} calcSlug={calcSlug} />;
}
